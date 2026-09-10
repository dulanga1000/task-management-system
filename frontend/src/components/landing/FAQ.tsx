"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does task assignment and ownership work?",
    answer:
      "Any task can be assigned to a specific team member upon creation or anytime afterward. Once assigned, team members can update, progress, and reorder their own tasks, while administrators retain full oversight over the entire workspace.",
  },
  {
    question: "Can I reorder tasks within the same column for priority?",
    answer:
      "Yes! TaskFlow supports vertical same-column drag-and-drop reordering. You can prioritize urgent items by moving them to the top of To Do, Doing, or Done, and the new sequence saves automatically.",
  },
  {
    question: "Can I attach documents and cover photos to tasks?",
    answer:
      "Yes. You can upload project assets, specifications, and screenshots. When you upload an image, you can set it as the card's cover to give your board a clean visual identity.",
  },
  {
    question: "How does role-based access control protect my project?",
    answer:
      "TaskFlow enforces granular role-based security. While everyone can view team progress, non-admin members can only modify tasks assigned to them. If an unauthorized edit is attempted, the card safely snaps back with an instant permission notice.",
  },
  {
    question: "Is there a real-time audit history of task modifications?",
    answer:
      "Every task includes an integrated Activity Feed. You can inspect who created the task, status transitions, reassignments, and content updates with accurate timestamps.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="border-t border-slate-200/80 bg-slate-50/50 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
            Frequently Asked Questions
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to know about TaskFlow
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Have questions about how TaskFlow fits into your workflow? Here are answers to common questions.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left text-base font-bold text-slate-900 transition-colors hover:text-blue-600 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 px-6 pb-6 pt-4 text-sm leading-6 text-slate-600 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
