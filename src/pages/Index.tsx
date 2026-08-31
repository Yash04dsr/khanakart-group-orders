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
                Group ordering for any outlet on campus
              </p>
              <h1 className="mt-6 font-display text-4xl md:text-6xl leading-[1.08] tracking-tight">
                Collect the group order. Then place it. No hustle.
              </h1>
              <p className="mt-5 text-lg md:text-xl text-khanakart-dark/70 max-w-xl">
                KhanaKart is for campus groups — hostels, clubs, labs, teams — ordering from{" "}
                <span className="text-khanakart-dark font-medium">any outlet on campus</span>
                : canteen, cafe, night shop, whatever you already eat from. Everyone adds their own items. You get one combined list, then you place the order.
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
                Not a delivery app. A shared cart for the outlet your campus group already uses.
              </p>
            </div>

            <HeroPreview />
          </div>
        </div>
      </section>

      <section className="container pb-8">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: MessageCircle, title: "Skip the collection hustle", body: "No chasing “what do you want?” across chat. People add their own items." },
            { icon: Users, title: "Any campus outlet", body: "Canteen, cafe, night shop, bakery — open a session for wherever the group is ordering." },
            { icon: UtensilsCrossed, title: "Then place one order", body: "You get names, items, and totals in one list — then you call or walk up to the outlet." },
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
          <p className="text-sm font-semibold uppercase tracking-wider text-khanakart-primary">How it works</p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl">Collect first. Order once.</h2>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              icon: ClipboardList,
              title: "Open a session for an outlet",
              body: "Name the outlet and set a cutoff — hostel night canteen, campus cafe, club dinner, lab lunch, anything on campus.",
            },
            {
              step: "02",
              icon: Users,
              title: "The group adds their items",
              body: "Everyone logs in and submits their own plate. No coordinator typing ten different orders by hand.",
            },
            {
              step: "03",
              icon: ShoppingBag,
              title: "Place the combined order",
              body: "When the deadline hits, you have one list: who ordered what, and the total. Then you place that single order at the outlet.",
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
            <p className="text-sm font-semibold uppercase tracking-wider text-khanakart-accent">Built for campus groups</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">Any outlet. One group. Zero collection drama.</h2>
            <p className="mt-4 text-white/70">
              This is not Swiggy. It is the shared cart for people who already eat together on campus and still waste twenty minutes collecting orders.
            </p>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Timer, title: "Hard deadlines", body: "Sessions close on time so you are not still collecting orders while standing at the counter." },
              { icon: Users, title: "Named plates", body: "Each person owns their items. Split bills and “who got the extra fries” stay obvious." },
              { icon: CheckCircle2, title: "Live as people join", body: "New items show up as soon as someone submits — useful while the rest of the hostel is still deciding." },
              { icon: Clock, title: "A record of past sessions", body: "Last night’s canteen run and yesterday’s club order stay on the dashboard." },
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
            <h2 className="font-display text-3xl md:text-4xl">Next campus order, minus the hustle.</h2>
            <p className="mt-3 text-khanakart-dark/70">
              Open a session for whatever outlet you are using, let the group add items, then place one combined order.
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
          <p>KhanaKart · Group ordering for any outlet on campus</p>
          <p>Hostels · clubs · labs · one combined cart</p>
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
          <p className="text-xs uppercase tracking-wide text-khanakart-neutral">Campus · live session</p>
          <p className="font-semibold">Night canteen · Hostel 4</p>
        </div>
        <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1">
          Open until 1:30 PM
        </span>
      </div>
      <div className="p-5 space-y-3">
        {[
          { name: "Yash", items: "Veg burger, cold coffee", total: "₹180" },
          { name: "Ananya", items: "Pasta, garlic bread", total: "₹220" },
          { name: "Rohit", items: "Maggi, masala chai", total: "₹70" },
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
        <p className="text-sm text-khanakart-dark/60">3 people ordered</p>
        <p className="font-display text-xl">₹470 combined</p>
      </div>
    </div>
  </div>
);

export default Index;
