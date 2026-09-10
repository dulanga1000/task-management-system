import { Kanban, PlusSquare, UserPlus } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create your workspace",
    description:
      "Sign up in seconds and get instant access to your personalized Kanban board.",
  },
  {
    number: "02",
    icon: PlusSquare,
    title: "Plan & assign tasks",
    description:
      "Add tasks with descriptions, priority levels, attachments, and assign team owners.",
  },
  {
    number: "03",
    icon: Kanban,
    title: "Ship with momentum",
    description:
      "Drag tasks across workflow stages, reorder priority tickets, and track progress effortlessly.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
            How It Works
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Up and running in three simple steps
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            No steep learning curve. Start organizing your team's workflow within minutes.
          </p>
        </div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          {/* Subtle horizontal connecting line on desktop */}
          <div className="pointer-events-none absolute left-1/6 right-1/6 top-10 hidden h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 md:block" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col items-center rounded-2xl border border-slate-200/70 bg-slate-50/40 p-8 text-center transition-all duration-200 hover:border-blue-200 hover:bg-white hover:shadow-lg hover:shadow-blue-500/5"
              >
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-white text-blue-600 shadow-sm">
                  <Icon className="h-6 w-6" />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white shadow-2xs">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}