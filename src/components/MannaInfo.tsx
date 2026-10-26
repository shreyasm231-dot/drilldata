import { Link } from "@tanstack/react-router";

export const MANNA = "https://www.mannafood.org";

export function SiteNav() {
  const cls = "sm";
  const active = { className: "sm on" };
  return (
    <nav className="row">
      <Link to="/app" className={cls} activeProps={active}>Workspace</Link>
      <Link to="/about" className={cls} activeProps={active}>About Manna</Link>
      <Link to="/blog" className={cls} activeProps={active}>Blog</Link>
      <Link to="/information" className={cls} activeProps={active}>Information</Link>
    </nav>
  );
}

export function SourceNote() {
  return (
    <div className="row mute" style={{ marginTop: 40, justifyContent: "space-between" }}>
      <span>Summarized from Manna Food Center's official website · Checked October 23, 2026.</span>
      <a className="dd-link" href={`${MANNA}/contact/`} target="_blank" rel="noreferrer">Contact Manna</a>
    </div>
  );
}

export const POSTS = [
  { topic: "Impact report", date: "October 21, 2026", title: "Farm to Food Bank FY2026 Impact Report", body: "Manna has published its latest Farm to Food Bank impact report. Visit the original report for the findings and program details.", href: `${MANNA}/impact-and-reports/farm-to-food-bank-fy2026-impact-report/` },
  { topic: "Advocacy", date: "July 7, 2026", title: "Join Manna's AdvocaSeeds community", body: "Manna introduced a volunteer advocacy community focused on storytelling, coalition-building, and a stronger food system. The August 15 priority deadline has passed; contact Manna about current opportunities.", href: `${MANNA}/manna-news/join-manna-food-centers-advocaseeds-community/` },
  { topic: "Community story", date: "June 30, 2026", title: "Inside the Box: A Manna Dinner Experience", body: "A June dinner with Chef Caleb and Nourish Culinary brought supporters together around food, community, and Manna's mission. This is a recap of a past event.", href: `${MANNA}/blog/inside-the-box-a-manna-dinner-experience/` },
  { topic: "Community story", date: "June 9, 2026", title: "The first Manna Open was a success", body: "Manna's first golf event welcomed 108 participants and raised more than $76,000. The recap also announces April 26, 2027 as the next Manna Open save-the-date.", href: `${MANNA}/blog/the-1st-manna-open-was-a-success/` },
  { topic: "Advocacy", date: "May 28, 2026", title: "CEO Message: World Hunger Day 2026", body: "Manna CEO Craig Rice reflects on household financial pressures, nutrition assistance, and dignity. This is Manna's dated perspective, not a statement of current benefits law.", href: `${MANNA}/blog/ceo-message-world-hunger-day-2026/` },
];
