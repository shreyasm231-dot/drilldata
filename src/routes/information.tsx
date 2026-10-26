import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DDShell } from "@/components/DDShell";
import { MANNA, POSTS, SiteNav, SourceNote } from "@/components/MannaInfo";

export const Route = createFileRoute("/information")({
  head: () => ({
    meta: [
      { title: "Resident information – DataDrill" },
      { name: "description", content: "How to get food from Manna, benefits help for SNAP and SUN Bucks, and Manna programs." },
      { property: "og:title", content: "Resident information – DataDrill" },
      { property: "og:description", content: "Food assistance, benefits support, and community updates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Info,
});

const PROGRAMS = [
  ["Food access", "Food for Families", "Food distributions offer prepacked boxes or market-style shopping. Manna also supports neighbors facing mobility barriers and provides grocery vouchers through this program."],
  ["Children & families", "School-Based Programs", "Weekly bags of shelf-stable food, monthly school markets, and grocery gift cards help families access food through school communities."],
  ["Benefits help", "Nutrition Benefits Outreach", "Manna helps neighbors apply for SNAP, SUN Bucks, and MC Groceries. Ask the outreach team which program fits your household and what documents are needed; eligibility is determined by the program, not this website."],
  ["Cooking & nutrition", "Community Food Education", "Practical cooking and nutrition education focuses on affordable food and respects participants' cultures and household needs."],
  ["Local food", "Farm to Food Bank", "Manna purchases produce and proteins from local farms and farmers markets to share with neighbors experiencing hunger."],
];

function Info() {
  const [tab, setTab] = useState<"programs" | "news" | "resources">("programs");
  const ext = { target: "_blank", rel: "noreferrer" };
  return (
    <DDShell right={<SiteNav />}>
      <div className="dd-wide">
        <p className="mute">HELP & CONNECTIONS</p>
        <h2>Resident information</h2>
        <p className="mb">Food assistance, benefits support, and community updates.</p>
        <div className="tabs">
          <button className="tab" aria-current={tab === "programs"} onClick={() => setTab("programs")}>Programs</button>
          <button className="tab" aria-current={tab === "news"} onClick={() => setTab("news")}>News & events</button>
          <button className="tab" aria-current={tab === "resources"} onClick={() => setTab("resources")}>Key resources</button>
        </div>
        <div className="panel mb">
          <h3>Get food from Manna</h3>
          <p>Call <a className="dd-link" href="tel:3014241130">301-424-1130</a>, Monday–Friday, 9 a.m.–4 p.m., to arrange a food pickup. Manna asks you to call by noon the day before pickup.</p>
          <p>Bring a photo ID and, if needed, another document showing your current Montgomery County address. Ask about dietary accommodations when scheduling.</p>
          <a className="dd-link" href={`${MANNA}/get-food/`} {...ext}>Pickup instructions and locations</a>
        </div>
        {tab === "programs" && (
          <div className="grid g2">
            {PROGRAMS.map(([k, t, d]) => (
              <div className="panel" key={t}>
                <p className="mute">{k}</p><h3>{t}</h3><p>{d}</p>
                <a className="dd-link" href={`${MANNA}/about-us/our-programs/`} {...ext}>Official program details</a>
              </div>
            ))}
          </div>
        )}
        {tab === "news" && (
          <div className="grid">
            {POSTS.map((p) => (
              <div className="panel" key={p.title}>
                <p className="mute">{p.topic} · {p.date}</p><h3>{p.title}</h3>
                <a className="dd-link" href={p.href} {...ext}>Read the original story</a>
              </div>
            ))}
          </div>
        )}
        {tab === "resources" && (
          <div className="grid g3">
            <div className="panel"><h3>Food assistance line</h3><p><a className="dd-link" href="tel:3014241130">301-424-1130</a></p><p className="mute">Mon–Fri, 9 a.m.–4 p.m.</p></div>
            <div className="panel"><h3>Get food</h3><a className="dd-link" href={`${MANNA}/get-food/`} {...ext}>Pickup locations</a></div>
            <div className="panel"><h3>All programs</h3><a className="dd-link" href={`${MANNA}/about-us/our-programs/`} {...ext}>Manna programs</a></div>
            <div className="panel"><h3>Contact</h3><a className="dd-link" href={`${MANNA}/contact/`} {...ext}>Contact Manna</a></div>
          </div>
        )}
        <SourceNote />
      </div>
    </DDShell>
  );
}
