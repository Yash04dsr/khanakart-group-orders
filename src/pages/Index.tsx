import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Clock,
  ClipboardList,
  Users,
  UtensilsCrossed,
  CheckCircle2,
  Timer,
  ShoppingBag,
  MessageCircle,
  GraduationCap,
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const dashboardHref = user?.role === "admin" ? "/admin" : "/member";
  const primaryCta = user
    ? { to: dashboardHref, label: "Open your dashboard" }
    : { to: "/login?signup=1", label: "Join your campus group" };

  return (
    <div className="bg-[#F7F4EE] text-khanakart-dark">
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(230,57,70,0.12),_transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(69,123,157,0.12),_transparent_45%)]" />
        <div className="container relative py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-khanakart-dark/10 bg-white px-3 py-1 text-sm font-medium text-khanakart-neutral">
                <GraduationCap className="h-3.5 w-3.5" />
                Campus group ordering · IIT Delhi
              </p>
              <h1 className="mt-6 font-display text-4xl md:text-6xl leading-[1.08] tracking-tight">
                The group order for your hostel, club, or OCS team.
              </h1>
              <p className="mt-5 text-lg md:text-xl text-khanakart-dark/70 max-w-xl">
                KhanaKart is campus-specific group food ordering. One person opens a Rajdhani session, everyone on the team adds their own plate, and you send the kitchen{" "}
                <span className="text-khanakart-dark font-medium">one combined order</span> before the cutoff — no WhatsApp archaeology.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-khanakart-primary hover:bg-khanakart-primary/90 text-white rounded-full px-6">
                  <Link to={primaryCta.to}>
                    {primaryCta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-khanakart-dark/20 bg-white">
                  <a href="#how-it-works">See how a session works</a>
                </Button>
              </div>
              <p className="mt-4 text-sm text-khanakart-dark/50">
                Built for IIT Delhi groups who already eat together — not a public food-delivery app.
              </p>
            </div>

            <HeroPreview />
          </div>
        </div>
      </section>

      <section className="container pb-8">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: MessageCircle, title: "Replaces the WhatsApp thread", body: "No more “+1 dal, no onion” buried 80 messages deep." },
            { icon: Users, title: "Everyone orders for themselves", body: "Hostel floor, lab, club, or OCS — each person submits their own dish list." },
            { icon: UtensilsCrossed, title: "One call to Rajdhani", body: "Admins get a single combined ticket with names, items, and totals." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-khanakart-dark/10 bg-white p-5">
              <item.icon className="h-5 w-5 text-khanakart-primary" />
              <h3 className="mt-3 font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-sm text-khanakart-dark/70">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="container py-16 md:py-24 scroll-mt-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-khanakart-primary">How a campus session works</p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl">From “who wants food?” to one kitchen ticket</h2>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              icon: ClipboardList,
              title: "Someone opens the session",
              body: "An admin (OCS coordinator, hostel mess lead, club secretary) starts a named order with a hard deadline.",
            },
            {
              step: "02",
              icon: Users,
              title: "The group adds dishes",
              body: "Members log in, pick from the Rajdhani menu, and submit their plate — including half portions when the kitchen allows it.",
            },
            {
              step: "03",
              icon: ShoppingBag,
              title: "You place one group order",
              body: "KhanaKart rolls every plate into one list: who ordered what, running totals, and a cutoff you can actually keep.",
            },
          ].map((item) => (
            <div key={item.step} className="rounded-2xl border border-khanakart-dark/10 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-khanakart-neutral">{item.step}</span>
                <item.icon className="h-5 w-5 text-khanakart-primary" />
              </div>
              <h3 className="mt-4 font-display text-2xl">{item.title}</h3>
              <p className="mt-2 text-khanakart-dark/70">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="bg-khanakart-dark text-white">
        <div className="container py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-khanakart-accent">Why it is campus-specific</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">Made for IIT Delhi groups, not for delivery apps</h2>
            <p className="mt-4 text-white/70">
              This is not Swiggy for campus. It is the shared cart your team already needs when ten people want Rajdhani at the same time.
            </p>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Timer, title: "Hard deadlines", body: "Sessions close on time so the person calling Rajdhani is not chasing last-minute texts." },
              { icon: Users, title: "Named plates", body: "Each student owns their order. Split bills and “who got the extra naan” stay obvious." },
              { icon: CheckCircle2, title: "Live as people join", body: "New dishes show up as soon as someone submits — useful when the lab is still filling in." },
              { icon: Clock, title: "A record of past sessions", body: "Yesterday’s OCS lunch and last hostel floor order stay on the dashboard." },
            ].map((feature) => (
              <div key={feature.title} className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <feature.icon className="h-5 w-5 text-khanakart-accent" />
                <h3 className="mt-4 font-semibold text-lg">{feature.title}</h3>
                <p className="mt-2 text-sm text-white/70">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="rounded-3xl bg-white border border-khanakart-dark/10 px-8 py-12 md:px-14 md:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl md:text-4xl">Open tonight’s campus order in one session.</h2>
            <p className="mt-3 text-khanakart-dark/70">
              Create an account, join your group’s live session, and add your Rajdhani dishes before the clock runs out.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Button asChild size="lg" className="bg-khanakart-primary hover:bg-khanakart-primary/90 text-white rounded-full px-6">
              <Link to={primaryCta.to}>{user ? "Go to dashboard" : "Create account"}</Link>
            </Button>
            {!user && (
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/login">Log in</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-khanakart-dark/10">
        <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-khanakart-dark/50">
          <p>KhanaKart · Campus group ordering for IIT Delhi</p>
          <p>OCS · hostels · clubs · one Rajdhani cart</p>
        </div>
      </footer>
    </div>
  );
};

const HeroPreview = () => (
  <div className="relative">
    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-khanakart-primary/20 to-khanakart-neutral/20 blur-2xl" />
    <div className="relative rounded-3xl border border-khanakart-dark/10 bg-white shadow-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-khanakart-dark/10 bg-[#F7F4EE]">
        <div>
          <p className="text-xs uppercase tracking-wide text-khanakart-neutral">IIT Delhi · live session</p>
          <p className="font-semibold">Friday Rajdhani · OCS</p>
        </div>
        <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1">
          Open until 1:30 PM
        </span>
      </div>
      <div className="p-5 space-y-3">
        {[
          { name: "Yash · OCS", items: "Dal Makhani, 2 Butter Naan", total: "₹240" },
          { name: "Ananya · Lab 4", items: "Paneer Tikka, Jeera Rice", total: "₹310" },
          { name: "Rohit · Hostel", items: "Half Dal Tadka, 1 Roti", total: "₹95" },
        ].map((row) => (
          <div key={row.name} className="flex items-center justify-between rounded-xl border border-khanakart-dark/10 bg-[#F7F4EE]/80 px-4 py-3">
            <div>
              <p className="font-medium">{row.name}</p>
              <p className="text-sm text-khanakart-dark/60">{row.items}</p>
            </div>
            <p className="font-semibold text-khanakart-primary">{row.total}</p>
          </div>
        ))}
      </div>
      <div className="px-5 py-4 border-t border-khanakart-dark/10 flex items-center justify-between bg-white">
        <p className="text-sm text-khanakart-dark/60">3 people from campus ordered</p>
        <p className="font-display text-xl">₹645 combined</p>
      </div>
    </div>
  </div>
);

export default Index;
