"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Carwow?",
    answer:
      "Carwow is an online platform for buying a new car or selling your old one! We bring you great offers from thousands of trusted partners so you can buy or sell your car in just a few clicks. No haggling and no fees.",
  },
  {
    question: "How does Carwow work?",
    answer:
      "You tell us what car you want, or which car you're selling, and we connect you with dealers or buyers offering the best prices.",
  },
  {
    question: "Does it cost me anything to use Carwow?",
    answer: "Nope! It's completely free for users.",
  },
];

export default function FAQSection() {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggle = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="bg-[#e9e7e4] py-16">
      <div className="max-w-3xl mx-53">
        <h2 className="text-2xl font-bold mb-6 text-black">FAQ</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden divide-y divide-gray-200">
          {faqs.map((item, index) => {
            const isOpen = openIndexes.includes(index);
            return (
              <div key={index}>
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between font-semibold text-black hover:bg-gray-50"
                >
                  {item.question}
                  <ChevronDown
                    className={`w-5 h-5 transform transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 px-6 py-4" : "max-h-0 px-6 py-0"
                  } text-gray-700`}
                >
                  <p className="transition-opacity duration-300">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
