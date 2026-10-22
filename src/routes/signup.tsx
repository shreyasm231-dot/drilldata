import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { DDShell } from "@/components/DDShell";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create a resident account – DataDrill" },
      { name: "description", content: "Apply for a DataDrill resident account to get help with SNAP and food benefits." },
      { property: "og:title", content: "Create a resident account – DataDrill" },
      { property: "og:description", content: "Apply for free, confidential benefits help from Manna." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Signup,
});

const NEEDS = ["SNAP / food benefits", "SUN Bucks (kids' summer food)", "MC Groceries", "Benefit renewal", "Language help", "Transportation"];

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  confirm: z.string(),
  full_name: z.string().trim().min(1, "Name is required").max(100),
  age: z.coerce.number().int().min(13, "You must be at least 13").max(120),
  household_size: z.coerce.number().int().min(1).max(20),
  zip_code: z.string().trim().regex(/^\d{5}$/, "ZIP code must be 5 digits"),
  preferred_language: z.string(),
  employment: z.string(),
  monthly_income: z.string(),
  situation: z.string().trim().min(10, "Tell us a little more (at least 10 characters)").max(2000),
}).refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

function Signup() {
  const [needs, setNeeds] = useState<string[]>([]);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const parsed = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) return setErr(parsed.error.issues[0]?.message ?? "Please check the form");
    const { email, password, confirm: _c, ...profile } = parsed.data;
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: window.location.origin, data: { ...profile, needs } },
    });
    setBusy(false);
    if (error) return setErr(error.message);
    setDone(true);
  }

  if (done) return (
    <DDShell>
      <div className="dd-auth panel">
        <h2>Check your email</h2>
        <p className="mute">We sent you a link to confirm your email. After that, our staff will review your application. You can sign in anytime to see its status.</p>
        <p style={{ marginTop: 16 }}><Link to="/" className="btn">Back to sign in</Link></p>
      </div>
    </DDShell>
  );

  return (
    <DDShell>
      <form className="panel dd-wide" onSubmit={submit}>
        <h2>Create a resident account</h2>
        <p className="mute mb">Free and confidential. Staff review every application before your account is activated.</p>
        <div className="panel warn mb mute">Please don't enter Social Security numbers, immigration documents or financial records here.</div>
        <h3>Account</h3>
        <div className="f mb">
          <label className="w"><span>Email</span><input name="email" type="email" required autoComplete="email" /></label>
          <label><span>Create password</span><input name="password" type="password" required autoComplete="new-password" /></label>
          <label><span>Confirm password</span><input name="confirm" type="password" required autoComplete="new-password" /></label>
        </div>
        <h3>About you</h3>
        <div className="f mb">
          <label><span>Full name</span><input name="full_name" required /></label>
          <label><span>Age</span><input name="age" type="number" min={13} max={120} required /></label>
          <label><span>People in household</span><input name="household_size" type="number" min={1} max={20} required /></label>
          <label><span>ZIP code</span><input name="zip_code" inputMode="numeric" required /></label>
          <label><span>Preferred language</span><select name="preferred_language"><option>English</option><option>Spanish</option><option>Amharic</option><option>Other</option></select></label>
          <label><span>Employment</span><select name="employment"><option>Employed full-time</option><option>Employed part-time</option><option>Unemployed</option><option>Retired</option><option>Student</option><option>Unable to work</option></select></label>
          <label><span>Household monthly income</span><select name="monthly_income"><option>Under $1,000</option><option>$1,000 – $2,000</option><option>$2,000 – $3,500</option><option>Over $3,500</option><option>Prefer not to say</option></select></label>
        </div>
        <h3>What do you need help with?</h3>
        <div className="row mb">
          {NEEDS.map((n) => (
            <button type="button" key={n} className={"sm" + (needs.includes(n) ? " on" : "")}
              onClick={() => setNeeds((v) => v.includes(n) ? v.filter((x) => x !== n) : [...v, n])}>{n}</button>
          ))}
        </div>
        <label className="mb"><span>Describe your situation</span><textarea name="situation" rows={5} required placeholder="For example: recently lost my job, two kids at home, need help applying for SNAP." /></label>
        {err && <div className="panel warn mb">{err}</div>}
        <div className="row">
          <button className="btn" disabled={busy}>{busy ? "Submitting…" : "Submit application"}</button>
          <Link to="/" className="dd-link">I already have an account</Link>
        </div>
      </form>
    </DDShell>
  );
}
