import {
  ArrowUpDown,
  History,
  Kanban,
  Paperclip,
  ShieldCheck,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Kanban,
    title: "Interactive Kanban Boards",
    description:
      "Effortlessly move tasks across To Do, Doing, and Done with smooth drag-and-drop and real-time state synchronization.",
    badge: "Workflow",
  },
  {
    icon: ArrowUpDown,
    title: "Priority & Vertical Sorting",
    description:
      "Reorder tasks vertically within any column to prioritize high-impact tickets and keep your daily focus crystal clear.",
    badge: "Organization",
  },
  {
    icon: Users,
    title: "Team Assignment & Ownership",
    description:
      "Delegate tasks directly to team members with dedicated avatars, ensuring accountability and clear ownership.",
    badge: "Collaboration",
  },
  {
    icon: Paperclip,
    title: "File Attachments & Covers",
    description:
      "Upload project assets, specs, and screenshots with instant cover previews backed by secure cloud storage.",
    badge: "Assets",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access Control",
    description:
      "Keep your project secure with granular permission enforcement preventing unauthorized modifications to tasks.",
    badge: "Security",
  },
  {
    icon: History,
    title: "Real-Time Activity Audit Log",
    description:
      "Review a complete timeline of every status change, assignment update, and task modification as it happens.",
    badge: "Transparency",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-t border-slate-200/80 bg-slate-50/60 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
            Platform Capabilities
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Everything your team needs to stay aligned
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Designed for velocity and clarity. TaskFlow removes the clutter so you can focus on building and shipping great work.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-slate-200 bg-white p-7 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-2.5 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}