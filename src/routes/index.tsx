import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DDShell } from "@/components/DDShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in – DataDrill" },
      { name: "description", content: "Sign in to DataDrill for Manna benefits help or the staff outreach workspace." },
      { property: "og:title", content: "Sign in – DataDrill" },
      { property: "og:description", content: "Benefits help for residents and an outreach workspace for staff." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [side, setSide] = useState<"resident" | "staff">("resident");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stay, setStay] = useState(true);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) nav({ to: "/app" }); });
  }, [nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) return setErr(error.message === "Invalid login credentials" ? "That email and password don't match." : error.message);
    if (stay) localStorage.removeItem("dd-ephemeral");
    else localStorage.setItem("dd-ephemeral", "1");
    sessionStorage.setItem("dd-alive", "1");
    nav({ to: "/app" });
  }

  return (
    <DDShell>
      <div className="dd-auth">
        <div className="tabs">
          <button className="tab" aria-current={side === "resident"} onClick={() => setSide("resident")}>Resident</button>
          <button className="tab" aria-current={side === "staff"} onClick={() => setSide("staff")}>Staff</button>
        </div>
        <form className="panel" onSubmit={submit}>
          <h2>{side === "resident" ? "Welcome back" : "Staff sign in"}</h2>
          <p className="mute mb">{side === "resident" ? "Sign in to request help and manage your appointments." : "Sign in to the outreach workspace."}</p>
          <div className="grid">
            <label><span>Email (your username)</span><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /></label>
            <label><span>Password</span><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>
            <label className="dd-check"><input type="checkbox" checked={stay} onChange={(e) => setStay(e.target.checked)} /> Keep me signed in</label>
            {err && <div className="panel warn">{err}</div>}
            <button className="btn" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
          </div>
          {side === "resident" && <p className="mute" style={{ marginTop: 18 }}>New here? <Link to="/signup" className="dd-link">Create an account</Link></p>}
          {side === "staff" && <p className="mute" style={{ marginTop: 18 }}>Staff accounts are set up by your organization.</p>}
        </form>
      </div>
    </DDShell>
  );
}
