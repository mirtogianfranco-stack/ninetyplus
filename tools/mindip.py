"""Find the quietest 10ms point in a window - a safe splice point inside continuous speech."""
import sys, wave, array
w=wave.open(__import__("os").environ.get("MSRC","raw16k.wav")); sr=w.getframerate()
raw=array.array('h'); raw.frombytes(w.readframes(w.getnframes()))
def dip(a,b,step=0.005):
    best=None; t=a
    while t<b:
        i=int(t*sr); j=int((t+0.02)*sr); seg=raw[i:j]
        r=(sum(x*x for x in seg)/max(1,len(seg)))**0.5
        if best is None or r<best[1]: best=(round(t,3),int(r))
        t+=step
    return best
for arg in sys.argv[1:]:
    a,b=map(float,arg.split('-'))
    print("%s -> dip at %.3f (rms %d)"%(arg,*dip(a,b)))
