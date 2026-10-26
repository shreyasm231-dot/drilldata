import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DDShell } from "@/components/DDShell";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({ meta: [{ title: "Workspace – DataDrill" }, { name: "robots", content: "noindex" }] }),
  component: AppPage,
});

type Profile = Tables<"profiles">;
declare global { interface Window { __DD?: unknown } }

function AppPage() {
  const [role, setRole] = useState<"staff" | "resident" | null>(null);
  const [me, setMe] = useState<Profile | null>(null);
  const [apps, setApps] = useState<Profile[]>([]);
  const [view, setView] = useState<"work" | "apps">("work");
  const [ready, setReady] = useState(false);
  const [dual, setDual] = useState(false);
  function switchSide() {
    localStorage.setItem("dd-side", role === "staff" ? "resident" : "staff");
    window.location.reload();
  }

  async function signOut() {
    localStorage.removeItem("dd-ephemeral");
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function loadApps() {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    setApps(data ?? []);
    return data ?? [];
  }

  useEffect(() => {
    (async () => {
      if (localStorage.getItem("dd-ephemeral") && !sessionStorage.getItem("dd-alive")) return signOut();
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
      const hasStaff = !!roles?.some((r) => r.role === "staff");
      const both = hasStaff && !!roles?.some((r) => r.role === "resident");
      setDual(both);
      const isStaff = hasStaff && !(both && localStorage.getItem("dd-side") === "resident");
      setRole(isStaff ? "staff" : "resident");
      if (isStaff) {
        const all = await loadApps();
        const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
        window.__DD = {
          side: "staff", me: u.user.email,
          acct: {
            total: all.length,
            pending: all.filter((p) => p.status === "pending").length,
            approved: all.filter((p) => p.status === "approved").length,
            rejected: all.filter((p) => p.status === "rejected").length,
            month: all.filter((p) => new Date(p.created_at) >= monthStart).length,
          },
        };
      } else {
        const { data: p } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
        setMe(p);
        window.__DD = { side: "resident", me: p?.full_name };
        if (p?.status !== "approved") return;
      }
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const s = document.createElement("script");
    s.src = "/datadrill.js";
    document.body.appendChild(s);
  }, [ready]);

  async function review(id: string, status: "approved" | "rejected") {
    await supabase.from("profiles").update({ status, reviewed_at: new Date().toISOString() }).eq("id", id);
    loadApps();
  }

  const pending = apps.filter((a) => a.status === "pending").length;
  const right = (
    <>
      {role === "staff" && (
        <>
          <button className={"sm" + (view === "work" ? " on" : "")} onClick={() => setView("work")}>Workspace</button>
          <button className={"sm" + (view === "apps" ? " on" : "")} onClick={() => setView("apps")}>Account applications{pending ? ` (${pending})` : ""}</button>
        </>
      )}
      {dual && <button className="sm" onClick={switchSide}>Switch to {role === "staff" ? "resident" : "staff"} view</button>}
      <button className="sm" onClick={signOut}>Sign out</button>
    </>
  );

  if (!role) return <DDShell right={right}><p className="mute">Loading…</p></DDShell>;

  if (role === "resident" && me?.status !== "approved") return (
    <DDShell right={right}>
      <div className="dd-auth panel">
        <h2>{me?.status === "rejected" ? "Application not approved" : "Application under review"}</h2>
        <p className="mute">
          {me?.status === "rejected"
            ? "Our staff couldn't approve your account. Please call Manna and we'll help you another way."
            : `Thanks${me?.full_name ? ", " + me.full_name : ""}! Our staff are reviewing your account. You'll get full access once it's approved.`}
        </p>
      </div>
    </DDShell>
  );

  return (
    <DDShell right={right}>
      {view === "apps" && <Applications apps={apps} onReview={review} />}
      <div id="m" style={{ display: view === "work" ? undefined : "none" }} />
    </DDShell>
  );
}

function Applications({ apps, onReview }: { apps: Profile[]; onReview: (id: string, s: "approved" | "rejected") => void }) {
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");
  const list = apps.filter((a) => a.status === filter);
  return (
    <>
      <h2>Account applications</h2>
      <p className="mute mb">Screen each resident's description before approving. Contact details stay hidden here.</p>
      <div className="tabs">
        {(["pending", "approved", "rejected"] as const).map((f) => (
          <button key={f} className="sm" aria-current={f === filter} data-on={f === filter} onClick={() => setFilter(f)} style={{ textTransform: "capitalize" }}>
            {f} ({apps.filter((a) => a.status === f).length})
          </button>
        ))}
      </div>
      {list.length === 0 && <div className="panel mute">No {filter} applications.</div>}
      <div className="grid g2">
        {list.map((a) => (
          <div className="panel" key={a.id}>
            <h3>{a.full_name || "Unnamed applicant"}</h3>
            <p className="mute">
              Age {a.age ?? "–"} · Household of {a.household_size ?? "–"} · ZIP {a.zip_code ?? "–"}<br />
              {a.preferred_language} · {a.employment} · Income {a.monthly_income}<br />
              Applied {new Date(a.created_at).toLocaleDateString()}
            </p>
            {a.needs.length > 0 && <div className="row" style={{ margin: "10px 0" }}>{a.needs.map((n) => <span key={n} className="pill">{n}</span>)}</div>}
            <p style={{ whiteSpace: "pre-wrap" }}>{a.situation}</p>
            {a.status === "pending" && (
              <div className="row" style={{ marginTop: 12 }}>
                <button className="btn" onClick={() => onReview(a.id, "approved")}>Approve</button>
                <button className="sm" onClick={() => onReview(a.id, "rejected")}>Decline</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
