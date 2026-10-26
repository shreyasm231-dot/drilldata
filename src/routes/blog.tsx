import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DDShell } from "@/components/DDShell";
import { POSTS, SiteNav, SourceNote } from "@/components/MannaInfo";
import img from "@/assets/manna-blog.webp.asset.json";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Community blog – DataDrill" },
      { name: "description", content: "Stories and updates from Manna Food Center: impact reports, advocacy and community events." },
      { property: "og:title", content: "Community blog – DataDrill" },
      { property: "og:description", content: "Food, connection, and the people behind Manna's work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Blog,
});

function Blog() {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("");
  const list = POSTS.filter((p) => (!topic || p.topic === topic) && (p.title + p.body).toLowerCase().includes(q.toLowerCase()));
  return (
    <DDShell right={<SiteNav />}>
      <div className="dd-wide">
        <p className="mute">STORIES & UPDATES</p>
        <h2>Community blog</h2>
        <p className="mb">Food, connection, and the people behind Manna's work.</p>
        <img className="dd-blog-photo" src={img.url} alt="Community members sharing a box of fresh produce at Manna" />
        <div className="f mb">
          <label><span>Search stories</span><input value={q} onChange={(e) => setQ(e.target.value)} /></label>
          <label><span>Topic</span>
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="">All topics</option><option>Impact report</option><option>Advocacy</option><option>Community story</option>
            </select>
          </label>
        </div>
        <div className="grid">
          {list.map((p) => (
            <article className="panel" key={p.title}>
              <p className="mute">{p.topic} · {p.date}</p>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
              <a className="dd-link" href={p.href} target="_blank" rel="noreferrer">Read the original story</a>
            </article>
          ))}
          {!list.length && <p className="mute">No stories match.</p>}
        </div>
        <p className="mute" style={{ marginTop: 24 }}>Summaries of official Manna publications, not new articles written by Manna.</p>
        <SourceNote />
      </div>
    </DDShell>
  );
}
