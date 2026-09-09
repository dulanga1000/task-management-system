const features = [
  {
    number: "01",
    title: "Organize tasks",
    description:
      "Create and organize tasks in one simple workspace so you always know what needs to be done.",
  },
  {
    number: "02",
    title: "Track progress",
    description:
      "Move tasks through To Do, Doing, and Done to get a clear view of your team's progress.",
  },
  {
    number: "03",
    title: "Work together",
    description:
      "Assign tasks to team members and keep everyone aligned around the work that matters.",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-t border-gray-100 bg-gray-50/60">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-blue-600">
            Everything you need
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            A focused workspace for getting work done.
          </h2>

          <p className="mt-4 text-base leading-7 text-gray-600">
            Keep your tasks organized, understand what's in progress, and
            focus on completing the work that matters.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="rounded-2xl border border-gray-200 bg-white p-7 transition-shadow duration-200 hover:shadow-lg hover:shadow-gray-200/50"
            >
              <span className="text-sm font-semibold text-blue-600">
                {feature.number}
              </span>

              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}