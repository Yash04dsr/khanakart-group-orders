import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate(user.role === "admin" ? "/admin" : "/member");
    }
  }, [user, navigate, isLoading]);

  if (isLoading || user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F7F4EE]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-khanakart-primary" />
      </div>
    );
  }

  return (
    <div className="bg-[#F7F4EE] text-khanakart-dark overflow-hidden">
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(230,57,70,0.12),_transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(69,123,157,0.12),_transparent_45%)]" />
        <div className="container relative py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-fade-up">
              <p className="inline-flex items-center gap-2 rounded-full border border-khanakart-dark/10 bg-white/70 px-3 py-1 text-sm font-medium text-khanakart-neutral">
                <UtensilsCrossed className="h-3.5 w-3.5" />
                Built for IIT Delhi teams
              </p>
              <h1 className="mt-6 font-display text-4xl md:text-6xl leading-[1.08] tracking-tight">
                One group order.
                <br />
                Zero WhatsApp chaos.
              </h1>
              <p className="mt-5 text-lg md:text-xl text-khanakart-dark/70 max-w-xl">
                KhanaKart is how OCS collects food orders. Open a session, everyone adds their Rajdhani dishes, and you get one combined order before the deadline.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-khanakart-primary hover:bg-khanakart-primary/90 text-white rounded-full px-6">
                  <Link to="/login?signup=1">
                    Get started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-khanakart-dark/20 bg-white/80">
                  <a href="#how-it-works">See how it works</a>
                </Button>
              </div>
              <p className="mt-4 text-sm text-khanakart-dark/50">
                Sign up with your email. Admins open sessions; members place orders.
              </p>
            </div>

            <div className="animate-fade-up [animation-delay:120ms]">
              <HeroPreview />
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="container py-16 md:py-24 scroll-mt-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-khanakart-primary">How it works</p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl">From hungry group to one kitchen ticket</h2>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              icon: ClipboardList,
              title: "Open a session",
              body: "An admin starts an order with a title and a cutoff time. That’s the window for the team to join.",
            },
            {
              step: "02",
              icon: Users,
              title: "Everyone adds dishes",
              body: "Members log in, pick items from the Rajdhani menu, and submit their own plate — including half portions where allowed.",
            },
            {
              step: "03",
              icon: ShoppingBag,
              title: "One combined order",
              body: "KhanaKart rolls everything up. Admins see who ordered what, totals, and can close the session on time.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-khanakart-dark/10 bg-white p-6 shadow-sm"
            >
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
            <p className="text-sm font-semibold uppercase tracking-wider text-khanakart-accent">Why KhanaKart</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">Made for the way campus teams actually eat</h2>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Timer, title: "Hard deadlines", body: "Sessions close when time is up, so the kitchen call is never a moving target." },
              { icon: Users, title: "Per-person orders", body: "Each member owns their list. No more editing a shared spreadsheet at 1am." },
              { icon: CheckCircle2, title: "Live updates", body: "New orders show up as they come in, so admins can watch the session fill." },
              { icon: Clock, title: "Clear history", body: "Past sessions stay on the dashboard — who ordered, what, and when." },
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
            <h2 className="font-display text-3xl md:text-4xl">Ready to collect tonight’s order?</h2>
            <p className="mt-3 text-khanakart-dark/70">
              Create an account, wait for an admin to open a session, and add your dishes before the clock runs out.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Button asChild size="lg" className="bg-khanakart-primary hover:bg-khanakart-primary/90 text-white rounded-full px-6">
              <Link to="/login?signup=1">Create account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-khanakart-dark/10">
        <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-khanakart-dark/50">
          <p>KhanaKart · Group food ordering for IIT Delhi</p>
          <p>OCS · Rajdhani orders, in one place</p>
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
          <p className="text-xs uppercase tracking-wide text-khanakart-neutral">Live session</p>
          <p className="font-semibold">Friday Rajdhani · OCS</p>
        </div>
        <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1">
          Open until 1:30 PM
        </span>
      </div>
      <div className="p-5 space-y-3">
        {[
          { name: "Yash", items: "Dal Makhani, 2 Butter Naan", total: "₹240" },
          { name: "Ananya", items: "Paneer Tikka, Jeera Rice", total: "₹310" },
          { name: "Rohit", items: "Half Dal Tadka, 1 Roti", total: "₹95" },
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
        <p className="font-display text-xl">₹645 combined</p>
      </div>
    </div>
  </div>
);

export default Index;
