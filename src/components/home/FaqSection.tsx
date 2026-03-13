// src/components/home/FaqSection.tsx
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { faqs } from "@/data/faqData";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  fadeInUp,
} from "@/components/ui/ScrollReveal";

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<string | null>(
    faqs[0]?.id || null,
  );

  const toggleAccordion = (id: string) => {
    setActiveIndex(activeIndex === id ? null : id);
  };

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-indigo-100 blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal variant={fadeInUp}>
          <div className="text-center mb-16">
            <span className="color-primary font-semibold tracking-wider uppercase text-sm mb-2 block">
              Trợ giúp học viên
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Câu hỏi thường gặp
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-600">
              Giải đáp những thắc mắc phổ biến nhất để giúp bạn có trải nghiệm
              học tập tuyệt vời nhất trên nền tảng của chúng tôi.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="space-y-4">
          {faqs.map((faq) => {
            const isActive = activeIndex === faq.id;

            return (
              <StaggerItem key={faq.id}>
                <div
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isActive
                      ? "border-blue-200 shadow-md ring-1 ring-blue-100"
                      : "border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <button
                    type="button"
                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none group cursor-pointer"
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isActive}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                          isActive
                            ? "bg-blue-100 color-primary"
                            : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500"
                        }`}
                      >
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <span
                        className={`font-semibold text-base md:text-lg transition-colors duration-300 ${
                          isActive
                            ? "text-blue-800"
                            : "text-slate-800 group-hover:text-blue-600"
                        }`}
                      >
                        {faq.question}
                      </span>
                    </div>
                    <div
                      className={`shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        isActive
                          ? "color-primary-bg text-white"
                          : "bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600"
                      }`}
                    >
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${
                          isActive ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isActive
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 pt-2 md:pl-20 text-slate-600 leading-relaxed text-base">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <ScrollReveal variant={fadeInUp}>
          <div className="mt-12 text-center bg-blue-50/50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Bạn vẫn còn thắc mắc?
            </h3>
            <p className="text-slate-600 mb-6">
              Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp mọi câu hỏi
              của bạn qua nhiều kênh liên lạc.
            </p>
            <a
              href=""
              className="inline-flex items-center justify-center px-6 py-3 rounded-full color-primary-bg text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:translate-y-[-2px]"
            >
              Liên hệ hỗ trợ ngay
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
