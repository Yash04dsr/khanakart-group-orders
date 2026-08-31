import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user } = useAuth();
  const dashboardHref = user?.role === "admin" ? "/admin" : "/member";
  const primaryCta = user
    ? { to: dashboardHref, label: "Go to dashboard" }
    : { to: "/login?signup=1", label: "Get started" };

  return (
    <div className="bg-white text-neutral-900">
      <section className="border-b border-neutral-200">
        <div className="container py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-semibold tracking-tight leading-[1.05]">
              Group ordering for campus outlets
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-neutral-600 max-w-2xl leading-relaxed">
              When a group eats together, someone still has to collect every item and place the order. KhanaKart is that layer: one session, everyone’s items, one list to take to any outlet on campus.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-11 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white px-5">
                <Link to={primaryCta.to}>{primaryCta.label}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 rounded-md px-5">
                <a href="#product">See how it works</a>
              </Button>
            </div>
          </div>

          <div className="mt-16 rounded-xl border border-neutral-200 bg-neutral-50 p-2 sm:p-4 shadow-sm">
            <ProductFrame />
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-200">
        <div className="container py-20 md:py-24 grid md:grid-cols-2 gap-12 md:gap-20">
          <div>
            <p className="text-sm font-medium text-neutral-500">Problem</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">The order is scattered before it is placed</h2>
            <p className="mt-4 text-neutral-600 leading-relaxed">
              Campus groups already know the outlet. What takes time is gathering who wants what — across messages, last-minute changes, and a list that only exists in one person’s head at the counter.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Product</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">A shared session that becomes one order</h2>
            <p className="mt-4 text-neutral-600 leading-relaxed">
              Create a session for any canteen, cafe, or night outlet. Each person adds their own items before a cutoff. You receive a single named list and a total, then place that order at the outlet.
            </p>
          </div>
        </div>
      </section>

      <section id="product" className="scroll-mt-20 border-b border-neutral-200">
        <div className="container py-20 md:py-24">
          <p className="text-sm font-medium text-neutral-500">How it works</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl">
            Three steps from a group to a single order
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-10">
            {[
              {
                n: "01",
                title: "Open a session",
                body: "Name the outlet and set a deadline. The group joins the same session.",
              },
              {
                n: "02",
                title: "Everyone adds items",
                body: "Each person submits their own order. You do not reconstruct it from chat.",
              },
              {
                n: "03",
                title: "Place one order",
                body: "Use the combined list — names, items, total — at the outlet.",
              },
            ].map((step) => (
              <div key={step.n}>
                <p className="text-sm font-medium text-neutral-400">{step.n}</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-neutral-600 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50">
        <div className="container py-20 md:py-24 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight">Start a session for your next group order</h2>
            <p className="mt-3 text-neutral-600">
              Works with any outlet on campus. Built for hostels, clubs, labs, and teams that already eat together.
            </p>
          </div>
          <Button asChild size="lg" className="h-11 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white px-5 shrink-0">
            <Link to={primaryCta.to}>{user ? "Go to dashboard" : "Get started"}</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-neutral-200">
        <div className="container py-8 flex flex-col sm:flex-row justify-between gap-2 text-sm text-neutral-500">
          <p>KhanaKart</p>
          <p>Group ordering for campus outlets</p>
        </div>
      </footer>
    </div>
  );
};

const ProductFrame = () => (
  <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
      <div>
        <p className="text-xs text-neutral-500">Session</p>
        <p className="font-medium">Night canteen · Hostel 4</p>
      </div>
      <span className="text-xs font-medium text-neutral-600 border border-neutral-200 rounded-full px-2.5 py-1">
        Open until 1:30 PM
      </span>
    </div>
    <div className="divide-y divide-neutral-100">
      {[
        { name: "Yash", items: "Veg burger, cold coffee", total: "₹180" },
        { name: "Ananya", items: "Pasta, garlic bread", total: "₹220" },
        { name: "Rohit", items: "Maggi, masala chai", total: "₹70" },
      ].map((row) => (
        <div key={row.name} className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-sm text-neutral-500">{row.items}</p>
          </div>
          <p className="text-sm font-medium tabular-nums">{row.total}</p>
        </div>
      ))}
    </div>
    <div className="px-5 py-4 border-t border-neutral-200 flex items-center justify-between bg-neutral-50">
      <p className="text-sm text-neutral-500">3 people</p>
      <p className="font-semibold tabular-nums">₹470 combined</p>
    </div>
  </div>
);

export default Index;
