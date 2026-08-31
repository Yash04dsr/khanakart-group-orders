import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ClipboardList,
  Users,
  ShoppingBag,
  Zap,
  Ban,
  Sparkles,
} from "lucide-react";

const outlets = [
  "Canteen",
  "Cafe",
  "Night shop",
  "Juice stall",
  "Bakery",
  "Hostel mess",
  "Club dinner",
  "Lab lunch",
  "Sports night",
  "Fest stall",
];

const Index = () => {
  const { user } = useAuth();
  const dashboardHref = user?.role === "admin" ? "/admin" : "/member";
  const primaryCta = user
    ? { to: dashboardHref, label: "Open dashboard" }
    : { to: "/login?signup=1", label: "Start a session free" };

  return (
    <div className="bg-khanakart-dark text-white overflow-x-hidden">
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-khanakart-primary/30 blur-3xl" />
          <div className="absolute bottom-0 left-[-8%] h-[22rem] w-[22rem] rounded-full bg-khanakart-neutral/25 blur-3xl" />
        </div>

        <div className="container relative py-16 md:py-20">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-10 items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-khanakart-accent">
                <Sparkles className="h-3.5 w-3.5" />
                The campus group-order pitch
              </p>
              <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
                Stop being
                <br />
                the order collector.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-white/70 max-w-xl">
                KhanaKart is the shared cart for campus. Any outlet. Everyone adds their own plate. You place{" "}
                <span className="text-white font-semibold">one combined order</span> — and get your night back.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 bg-khanakart-primary hover:bg-khanakart-primary/90 text-white rounded-full px-7 text-base shadow-[0_0_40px_rgba(230,57,70,0.45)]"
                >
                  <Link to={primaryCta.to}>
                    {primaryCta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white px-7"
                >
                  <a href="#pitch">See the pitch</a>
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/55">
                <span>Any campus outlet</span>
                <span>Live group session</span>
                <span>One list → one order</span>
              </div>
            </div>

            <HeroPreview />
          </div>
        </div>
      </section>

      <div className="border-y border-white/10 bg-black/20 py-4 overflow-hidden">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-sm font-medium uppercase tracking-[0.22em] text-white/50">
          {[...outlets, ...outlets].map((name, i) => (
            <span key={`${name}-${i}`} className="flex items-center gap-10">
              {name}
              <span className="text-khanakart-primary">●</span>
            </span>
          ))}
        </div>
      </div>

      <section id="pitch" className="scroll-mt-20">
        <div className="container py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-khanakart-primary font-semibold uppercase tracking-[0.2em] text-xs">The problem</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl leading-tight">
              Campus groups already know where to eat. The hustle is collecting the order.
            </h2>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <Ban className="h-5 w-5 text-white/70" />
              </div>
              <h3 className="mt-5 font-display text-2xl">The old way</h3>
              <ul className="mt-4 space-y-3 text-white/65">
                <li>“What do you want?” × 12 in the group chat</li>
                <li>Someone changes their mind at the counter</li>
                <li>You still don’t know who owes for the extra fries</li>
                <li>You are the unpaid waiter for your hostel floor</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-khanakart-primary/40 bg-khanakart-primary/10 p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-khanakart-primary">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-5 font-display text-2xl">The KhanaKart way</h3>
              <ul className="mt-4 space-y-3 text-white/85">
                <li>Open a session. Name any campus outlet.</li>
                <li>Everyone adds their own items before the cutoff</li>
                <li>You get one named list and a total</li>
                <li>Then you place the order. That’s the whole product.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-[#F7F4EE] text-khanakart-dark scroll-mt-20">
        <div className="container py-20 md:py-28">
          <p className="text-khanakart-primary font-semibold uppercase tracking-[0.2em] text-xs">How it works</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl max-w-2xl leading-tight">
            Three moves. Dinner is handled.
          </h2>
          <div className="mt-14 grid md:grid-cols-3 gap-10">
            {[
              {
                n: "01",
                icon: ClipboardList,
                title: "Open it",
                body: "Pick the outlet — canteen, cafe, night shop, wherever. Set a deadline.",
              },
              {
                n: "02",
                icon: Users,
                title: "They add",
                body: "The group dumps their plates into the session. You stop pinging people.",
              },
              {
                n: "03",
                icon: ShoppingBag,
                title: "You order",
                body: "One combined ticket. Walk up, call, or send it. You’re done.",
              },
            ].map((step) => (
              <div key={step.n}>
                <p className="font-display text-5xl text-khanakart-primary/80">{step.n}</p>
                <div className="mt-4 flex items-center gap-2">
                  <step.icon className="h-5 w-5 text-khanakart-primary" />
                  <h3 className="font-display text-2xl">{step.title}</h3>
                </div>
                <p className="mt-3 text-khanakart-dark/70 text-lg">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-20">
        <div className="container py-20 md:py-28">
          <div className="rounded-[2rem] bg-khanakart-primary px-8 py-14 md:px-16 md:py-20 text-center">
            <p className="text-white/80 font-semibold uppercase tracking-[0.2em] text-xs">Ready when the group is hungry</p>
            <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight max-w-3xl mx-auto">
              Tonight, don’t collect the order. Launch it.
            </h2>
            <p className="mt-5 text-lg text-white/85 max-w-xl mx-auto">
              Any outlet on campus. One session. Everyone in. One order out.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 h-12 rounded-full bg-white text-khanakart-primary hover:bg-white/90 px-8 text-base font-semibold"
            >
              <Link to={primaryCta.to}>
                {user ? "Go to dashboard" : "Get KhanaKart"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/40">
          <p>KhanaKart</p>
          <p>Campus group orders · any outlet</p>
        </div>
      </footer>
    </div>
  );
};

const HeroPreview = () => (
  <div className="relative lg:pl-6">
    <div className="absolute -top-6 -left-2 z-10 rounded-2xl border border-white/10 bg-khanakart-dark/90 px-4 py-3 shadow-xl backdrop-blur">
      <p className="text-[11px] uppercase tracking-wider text-white/50">Group chat</p>
      <p className="text-sm text-white/40 line-through">wait what did rohit want</p>
    </div>
    <div className="animate-float relative rounded-3xl border border-white/10 bg-white text-khanakart-dark shadow-2xl overflow-hidden mt-8 ml-6">
      <div className="flex items-center justify-between px-5 py-4 border-b border-khanakart-dark/10 bg-[#F7F4EE]">
        <div>
          <p className="text-xs uppercase tracking-wide text-khanakart-neutral">Live session</p>
          <p className="font-semibold">Night canteen · Hostel 4</p>
        </div>
        <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1">
          Filling up
        </span>
      </div>
      <div className="p-5 space-y-3">
        {[
          { name: "Yash", items: "Veg burger, cold coffee", total: "₹180" },
          { name: "Ananya", items: "Pasta, garlic bread", total: "₹220" },
          { name: "Rohit", items: "Maggi, masala chai", total: "₹70" },
        ].map((row) => (
          <div
            key={row.name}
            className="flex items-center justify-between rounded-xl border border-khanakart-dark/10 bg-[#F7F4EE]/80 px-4 py-3"
          >
            <div>
              <p className="font-medium">{row.name}</p>
              <p className="text-sm text-khanakart-dark/60">{row.items}</p>
            </div>
            <p className="font-semibold text-khanakart-primary">{row.total}</p>
          </div>
        ))}
      </div>
      <div className="px-5 py-4 border-t border-khanakart-dark/10 flex items-center justify-between bg-white">
        <p className="text-sm text-khanakart-dark/60">Ready to place</p>
        <p className="font-display text-xl">₹470 combined</p>
      </div>
    </div>
  </div>
);

export default Index;
