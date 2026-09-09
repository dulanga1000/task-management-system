const steps = [
  {
    number: "01",
    title: "Create your account",
    description:
      "Register your account and access your personal task management workspace.",
  },
  {
    number: "02",
    title: "Create your tasks",
    description:
      "Add tasks with a title and description, then organize them based on their current status.",
  },
  {
    number: "03",
    title: "Move work forward",
    description:
      "Drag tasks between columns as your work progresses from To Do to Doing and Done.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="text-center">
          <p className="text-sm font-semibold text-blue-600">How it works</p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple from day one.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
            Get your work organized in just a few simple steps.
          </p>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                {step.number}
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                {step.title}
              </h3>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}