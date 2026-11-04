#!/usr/bin/env python3
"""Season results + team form from ESPN scoreboards (no xG). Usage: python3 tools/espn-form.py eng.1 20260801 20261105 out.json
Prints per-team: GP W D L GF GA, home/away splits, last-5, BTTS, 3+ goal games, clean sheets, failed to score."""
import json, sys, urllib.request, datetime as dt
lg, a, b, out = sys.argv[1:5]
d = dt.date(int(a[:4]), int(a[4:6]), int(a[6:])); end = dt.date(int(b[:4]), int(b[4:6]), int(b[6:]))
from concurrent.futures import ThreadPoolExecutor
days = [d + dt.timedelta(days=i) for i in range((end - d).days + 1)]
def day(x):
    u = f'https://site.api.espn.com/apis/site/v2/sports/soccer/{lg}/scoreboard?dates={x:%Y%m%d}'
    for k in range(4):
        try: return json.load(urllib.request.urlopen(u, timeout=30)).get('events', [])
        except Exception: pass
    return []
games = {}
with ThreadPoolExecutor(8) as ex:
    for evs in ex.map(day, days):
        for e in evs:
            c = e['competitions'][0]
            if not c['status']['type']['completed']: continue
            s = {x['homeAway']: x for x in c['competitors']}
            games[e['id']] = dict(date=e['date'], h=s['home']['team']['displayName'], a=s['away']['team']['displayName'], hg=int(s['home']['score']), ag=int(s['away']['score']))
G = sorted(games.values(), key=lambda g: g['date'])
T = {}
for g in G:
    for side, me, op, gf, ga in (('h', g['h'], g['a'], g['hg'], g['ag']), ('a', g['a'], g['h'], g['ag'], g['hg'])):
        t = T.setdefault(me, dict(res=[], home=[], away=[]))
        r = 'W' if gf > ga else 'D' if gf == ga else 'L'
        row = dict(r=r, gf=gf, ga=ga, op=op, side=side, date=g['date'][:10])
        t['res'].append(row); t['home' if side == 'h' else 'away'].append(row)
json.dump(dict(games=G, teams=T), open(out, 'w'))
def agg(rs):
    return dict(gp=len(rs), w=sum(r['r']=='W' for r in rs), d=sum(r['r']=='D' for r in rs), l=sum(r['r']=='L' for r in rs), gf=sum(r['gf'] for r in rs), ga=sum(r['ga'] for r in rs))
tab = sorted(T.items(), key=lambda kv: (-(3*agg(kv[1]['res'])['w']+agg(kv[1]['res'])['d']), -(agg(kv[1]['res'])['gf']-agg(kv[1]['res'])['ga'])))
for i, (n, t) in enumerate(tab, 1):
    A, H, W = agg(t['res']), agg(t['home']), agg(t['away'])
    rs = t['res']
    print(f"{i:2} {n[:22]:22} {A['gp']:2} {A['w']}-{A['d']}-{A['l']} {A['gf']:2}-{A['ga']:<2} pts {3*A['w']+A['d']:2} | H {H['w']}-{H['d']}-{H['l']} {H['gf']}-{H['ga']} | A {W['w']}-{W['d']}-{W['l']} {W['gf']}-{W['ga']} | last5 {''.join(r['r'] for r in rs[-5:])} | btts {sum(r['gf']>0 and r['ga']>0 for r in rs)} 3+ {sum(r['gf']+r['ga']>=3 for r in rs)} cs {sum(r['ga']==0 for r in rs)} fts {sum(r['gf']==0 for r in rs)}")
