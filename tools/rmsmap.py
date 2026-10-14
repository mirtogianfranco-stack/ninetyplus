import sys, wave, array, math
p, a, b = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
w = wave.open(p, 'rb'); sr = w.getframerate(); n = w.getnframes()
w.setpos(int(a*sr)); raw = w.readframes(min(int((b-a)*sr), n-int(a*sr)))
s = array.array('h'); s.frombytes(raw)
step = int(sr*0.05)
out=[]
for i in range(0, len(s)-step, step):
    chunk = s[i:i+step]
    r = int(math.sqrt(sum(x*x for x in chunk)/len(chunk)))
    t = a + i/sr
    out.append((t, r))
for t, r in out:
    bar = '#' * min(40, r//60)
    print(f"{t:7.2f} {r:5d} {bar}")
