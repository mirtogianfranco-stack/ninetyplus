#!/usr/bin/env python3
"""Live grader for a weekend's picks from ESPN. Usage: python3 tools/track.py video-projects/wk-1031/track.json [--json]
Each pick: {card, label, league, date(YYYYMMDD), home, away (ESPN displayName substrings), type, ...}
types: win(team='home'|'away'), win_or_draw(team), goals_over(n: 3+ means >= n), goals_under(n: n or fewer),
btts, scorer(player substring)."""
import json, sys, urllib.request

cfg = json.load(open(sys.argv[1]))
cache = {}
def board(lg, d):
    k = (lg, d)
    if k not in cache:
        u = f'https://site.api.espn.com/apis/site/v2/sports/soccer/{lg}/scoreboard?dates={d}'
        cache[k] = json.load(urllib.request.urlopen(u, timeout=20))['events']
    return cache[k]

def grade(p):
    for e in board(p['league'], p['date']):
        comp = e['competitions'][0]
        side = {c['homeAway']: c for c in comp['competitors']}
        if p['home'] in side['home']['team']['displayName'] and p['away'] in side['away']['team']['displayName']:
            break
    else:
        return dict(state='?', score='-', clock='not found', verdict='?')
    st = comp['status']['type']
    state = 'post' if st['completed'] else st['state']  # pre / in / post
    h, a = int(side['home'].get('score') or 0), int(side['away'].get('score') or 0)
    clock = st.get('shortDetail', '')
    t = p['type']; done = state == 'post'
    me = (h, a) if p.get('team') == 'home' else (a, h)
    if t == 'win': ok = me[0] > me[1]; v = 'WON' if done and ok else 'LOST' if done else ('winning' if ok else 'level' if h == a else 'losing')
    elif t == 'win_or_draw': ok = me[0] >= me[1]; v = 'WON' if done and ok else 'LOST' if done else ('on track' if ok else 'losing')
    elif t == 'goals_over':
        ok = h + a >= p['n']; v = 'WON' if ok else 'LOST' if done else f'{h+a}/{p["n"]} goals'
    elif t == 'goals_under':
        ok = h + a <= p['n']; v = 'LOST' if not ok else 'WON' if done else f'{h+a} goals, max {p["n"]}'
    elif t == 'btts':
        ok = h > 0 and a > 0; v = 'WON' if ok else 'LOST' if done else ('home in' if h else 'away in' if a else 'neither yet')
    elif t == 'scorer':
        goals = [d for d in comp.get('details', []) if d.get('scoringPlay') and not d.get('ownGoal') and any(p['player'].lower() in (x.get('displayName') or '').lower() for x in d.get('athletesInvolved', []))]
        ok = bool(goals); v = 'WON' if ok else 'LOST' if done else 'not yet'
        if goals: clock += ' · ' + ', '.join(g['clock']['displayValue'] for g in goals)
    if state == 'pre': v = 'not started'
    return dict(state=state, score=f'{h}-{a}', clock=clock, verdict=v)

rows = []
for p in cfg['picks']:
    g = grade(p); rows.append({**p, **g})
if '--json' in sys.argv:
    print(json.dumps([{k: r[k] for k in ('card', 'label', 'state', 'score', 'clock', 'verdict')} for r in rows])); sys.exit()
for card in dict.fromkeys(r['card'] for r in rows):
    rs = [r for r in rows if r['card'] == card]
    status = 'BUST' if any(r['verdict'] == 'LOST' for r in rs) else 'LANDED' if all(r['verdict'] == 'WON' for r in rs) else 'alive'
    print(f'== {card}: {status}')
    for r in rs:
        mark = {'WON': '✅', 'LOST': '❌'}.get(r['verdict'], '⏳')
        print(f'  {mark} {r["label"]:<34} {r["score"]:>5}  {r["clock"]:<22} {r["verdict"]}')
