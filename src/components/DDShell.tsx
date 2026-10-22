import { useEffect, useRef, type ReactNode } from "react";

export function DDShell({ children, right }: { children: ReactNode; right?: ReactNode }) {
  const follower = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, raf = 0;
    const move = (e: MouseEvent) => { x = e.clientX; y = e.clientY; };
    const tick = () => {
      cx += (x - cx) * 0.12; cy += (y - cy) * 0.12;
      if (follower.current) follower.current.style.transform = `translate(${cx + 18}px, ${cy + 18}px)`;
      raf = requestAnimationFrame(tick);
    };
    addEventListener("mousemove", move);
    tick();
    return () => { removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="dd-root">
      <div className="dd-bg" aria-hidden>
        <span className="shape blob1" /><span className="shape blob2" /><span className="shape ring" />
        <span className="shape pill-s" /><span className="shape sun" />
        <div className="dd-word">DataDrill</div>
      </div>
      <div ref={follower} className="dd-follow" aria-hidden>● DataDrill</div>
      <div className="dd-content">
        <header>
          <b>DataDrill · Manna</b>
          <div className="row">{right}</div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
