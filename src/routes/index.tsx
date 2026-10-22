import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DataDrill – Manna benefits help & outreach workspace" },
      { name: "description", content: "Free, confidential help applying for SNAP and food benefits, plus a staff outreach workspace." },
      { property: "og:title", content: "DataDrill – Manna benefits workspace" },
      { property: "og:description", content: "Request benefits help and manage outreach in one workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const follower = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "/datadrill.js";
    document.body.appendChild(s);

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
        <span className="shape tri" /><span className="shape hex" /><span className="shape ring" />
        <span className="shape sq" /><span className="shape dia" />
        <div className="dd-word">DataDrill</div>
      </div>
      <div ref={follower} className="dd-follow" aria-hidden>◆ DataDrill</div>
      <div className="dd-content">
        <header>
          <b>DataDrill · Manna</b>
          <div className="tabs" style={{ margin: 0 }}>
            <button className="tab" data-a="side" data-v="resident">Resident side</button>
            <button className="tab" data-a="side" data-v="staff">Staff side</button>
          </div>
        </header>
        <main id="m" />
      </div>
    </div>
  );
}
