import sys, wave, array, math
p = sys.argv[1]; pts = [float(x) for x in sys.argv[2:]]
w = wave.open(p,'rb'); sr=w.getframerate(); n=w.getnframes()
w.setpos(0); s=array.array('h'); s.frombytes(w.readframes(n))
def rms(t, win=0.02):
    i=int(t*sr); k=int(win*sr); c=s[max(0,i-k//2):i+k//2]
    return int(math.sqrt(sum(x*x for x in c)/max(1,len(c))))
for t in pts:
    best=(rms(t), t)
    for d in range(-12, 13):
        tt = t + d*0.01
        if tt <= 0: continue
        r = rms(tt)
        if r < best[0]: best=(r, tt)
    print(f"{t:7.2f} rms {rms(t):5d}  -> best {best[1]:7.3f} rms {best[0]:5d}")
