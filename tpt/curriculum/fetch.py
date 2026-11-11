"""Fetch an Ontario curriculum course from the Ministry Curriculum and Resources content API and print strands,
overall and specific expectations. Usage: python3 curriculum/fetch.py <codename> > out.txt
Codenames: ele___math___grade_1..grade_6, ele___math___grade_6__copy_ (G7), ele___math___grade_8, hist___grade_7__2025_ (G7 history),
hist___grade_7__2025___copy_ (G8 history), kindergarten, sshg___grade_1 (G1 SS) ... see the l2___course list on the site."""
import json, subprocess, sys, tempfile, os
cn = sys.argv[1]; f = os.path.join(tempfile.mkdtemp(), cn + ".json")
subprocess.run(["curl", "-sS", "-m", "90", "-o", f, f"https://ws.api.dcp.edu.gov.on.ca/content/api/items/{cn}?language=en-CA&depth=6"], check=True)
sys.argv = [sys.argv[0], f]
import re, html
d=json.load(open(sys.argv[1])); m=d['modular_content']; it=d['item']
def tx(v): return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',v))).strip()
def el(cn):
    e=m[cn]['elements']
    ex=[]
    for l in e.get('elaborations',{}).get('value',[]):
        if l in m: ex+= [tx(v['value']) for k,v in m[l]['elements'].items() if v['type']=='rich_text' and v['value']]
    return ex
strands=[v for v in m.values() if v['system']['type']=='l3___strand']
order=it['elements']['sections']['value']
def walk_strand(cn):
    s=m[cn]['elements']; print(f"\n## STRAND {s['title_index']['value']}: {s['title']['value']}")
    for o in s['overall_expectations']['value']:
        if o not in m: continue
        oe=m[o]['elements']; print(f"\n{oe['title_index']['value']} {oe['title']['value']}: {tx(oe['content']['value'])}")
        for sp in oe['specific_expectations']['value']:
            if sp not in m: continue
            se=m[sp]['elements']; print(f"  {se.get('title_index',se.get('expectation_number',{'value':'?'}))['value']} {tx(se.get('content',se.get('expectation',{'value':''}))['value'])}")
            if '-e' in sys.argv:
                for x in el(sp): print('     ~', x[:600])
seen=[]
def find(cn,depth=0):
    if cn not in m or depth>4: return
    t=m[cn]['system']['type']
    if t=='l3___strand':
        if cn not in seen: seen.append(cn); walk_strand(cn)
        return
    for k,v in m[cn]['elements'].items():
        if v['type']=='modular_content':
            for l in v['value']: find(l,depth+1)
for l in order: find(l)
