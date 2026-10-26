import { createFileRoute } from "@tanstack/react-router";
import { DDShell } from "@/components/DDShell";
import { MANNA, SiteNav, SourceNote } from "@/components/MannaInfo";
import img from "@/assets/manna-about.webp.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Manna Food Center – DataDrill" },
      { name: "description", content: "Manna Food Center's mission: food access, education and advocacy in Montgomery County since 1983." },
      { property: "og:title", content: "About Manna Food Center – DataDrill" },
      { property: "og:description", content: "Neighbors supporting neighbors in Montgomery County, Maryland." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <DDShell right={<SiteNav />}>
      <div className="dd-wide">
        <p className="mute">Montgomery County, Maryland · Since 1983</p>
        <h2>Manna Food Center</h2>
        <p className="mb" style={{ fontSize: 20 }}>Food for all. A community where everyone has enough to eat.</p>
        <img className="dd-blog-photo" src={img.url} alt="Manna Food Center staff sharing information at a community event" />
        <div className="panel mb">
          <p className="mute">ABOUT US</p>
          <h3>Neighbors supporting neighbors</h3>
          <p>Manna works to eliminate hunger in Montgomery County through food distribution, education, and advocacy.</p>
          <p>Founded in 1983, Manna is the county's largest community-based food assistance provider. Working with neighbors, volunteers, and partners, Manna shares healthy food today and supports lasting solutions to food insecurity.</p>
          <a className="dd-link" href={`${MANNA}/about-us/`} target="_blank" rel="noreferrer">Manna's mission and history</a>
        </div>
        <h3>More than a box of food</h3>
        <div className="grid g3 mb">
          {[["Food access", "Food distribution and local farm partnerships help families put nutritious food on the table."],
            ["Education", "Cooking and nutrition programs connect everyday food skills with culture, affordability, and health."],
            ["Advocacy", "Manna works with the community to address the systems and challenges behind hunger."]].map(([t, d]) => (
            <div className="panel" key={t}><h3>{t}</h3><p>{d}</p></div>
          ))}
        </div>
        <a className="dd-link" href={`${MANNA}/about-us/our-programs/`} target="_blank" rel="noreferrer">Explore Manna's programs</a>
        <div className="panel" style={{ marginTop: 28 }}>
          <h3>You are welcome here</h3>
          <p>Manna welcomes Montgomery County residents and states that it does not ask about immigration status or report personal information to the government.</p>
          <p>For food assistance, call <a className="dd-link" href="tel:3014241130">301-424-1130</a>.</p>
          <a className="dd-link" href={`${MANNA}/get-food/`} target="_blank" rel="noreferrer">Official food assistance information</a>
        </div>
        <SourceNote />
      </div>
    </DDShell>
  );
}
