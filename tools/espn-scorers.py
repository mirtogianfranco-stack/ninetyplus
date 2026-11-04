#!/usr/bin/env python3
"""Season goalscorers from ESPN scoring plays (no own goals). Usage: python3 tools/espn-scorers.py eng.1 20260801 20261105 [N]
Prints top N scorers: goals, penalties, games scored in, team, and goals in the last 5 team games."""
import json, sys, urllib.request, datetime as dt
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
lg, a, b = sys.argv[1:4]; N = int(sys.argv[4]) if len(sys.argv) > 4 else 15
d0 = dt.date(int(a[:4]), int(a[4:6]), int(a[6:])); d1 = dt.date(int(b[:4]), int(b[4:6]), int(b[6:]))
def day(x):
    u = f'https://site.api.espn.com/apis/site/v2/sports/soccer/{lg}/scoreboard?dates={x:%Y%m%d}'
    for _ in range(4):
        try: return json.load(urllib.request.urlopen(u, timeout=30)).get('events', [])
        except Exception: pass
    return []
evs = []
with ThreadPoolExecutor(8) as ex:
    for r in ex.map(day, [d0 + dt.timedelta(days=i) for i in range((d1 - d0).days + 1)]): evs += r
evs = sorted({e['id']: e for e in evs if e['competitions'][0]['status']['type']['completed']}.values(), key=lambda e: e['date'])
team_games = defaultdict(list); P = defaultdict(lambda: dict(g=0, pen=0, games=set(), team=''))
for e in evs:
    c = e['competitions'][0]; ids = {x['team']['id']: x['team']['displayName'] for x in c['competitors']}
    for tid in ids: team_games[ids[tid]].append(e['id'])
    for x in c.get('details', []):
        if not x.get('scoringPlay') or x.get('ownGoal'): continue
        for ath in x.get('athletesInvolved', [])[:1]:
            p = P[ath['displayName']]; p['g'] += 1; p['games'].add(e['id']); p['team'] = ids.get(x.get('team', {}).get('id'), p['team'])
            if x.get('penaltyKick'): p['pen'] += 1
for n, p in sorted(P.items(), key=lambda kv: -kv[1]['g'])[:N]:
    last5 = team_games[p['team']][-5:]
    print(f"{n[:24]:24} {p['team'][:20]:20} {p['g']:2} g ({p['pen']} pen) scored in {len(p['games'])}/{len(team_games[p['team']])} | last 5 team games: {sum(1 for x in last5 if x in p['games'])} with a goal")
