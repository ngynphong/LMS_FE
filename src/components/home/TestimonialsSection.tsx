import { FaStar } from "react-icons/fa";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  fadeInUp,
} from "../ui/ScrollReveal";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Nguyễn Thị C",
    role: "Học sinh tiểu học",
    content:
      "Con rất thích học ở IES EDU. Thầy cô giảng bài dễ hiểu và luôn giúp con khi con chưa hiểu bài.",
    rating: 5,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuALNti7aymXiKX0TlrB2nTKflobYTAgvBV7vLhafEAPDTv7Ghvt4T_w0tWXHuJ9FoPGA8lgU7kwYuaUr6_5nBN0T2ldahG7ffkTrI6zs85o0qFQo9OPIfiKg7iftx6SCO3H8joiSg66_aWAwbtxNFvRPJyxHxaYzp6D9qaDETaSZsM7OmsNGlUy6xvpLOIJfFfeTNDpxTMbNvgHNWF2fYsmCN8lhH8I2-rgI0pS0Y3Yk0HuoCodTTa19jG4Q0eHdiu5cChXCd8ZflRU",
  },
  {
    id: 2,
    name: "Trần Minh K",
    role: "Học sinh tiểu học",
    content:
      "Học ở đây rất vui. Con được làm nhiều bài tập hay và hiểu bài nhanh hơn ở lớp.",
    rating: 5,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEAZNdV59tM24ZyPQtutC0DsV5iPwbbVXqNSv_xHTAvjCVZ5ZlvneBg51omybsDKWkby5kUM93hspPnxHgZehh7LJNIztxRzJhFZ33vuoXXL89PyUOS_psF0zAjL18LtaBAhygZCgCH9BFwbpu2deWXzvllQaHEQCshCMdDMPKaqwEsMmwO64FfoClwOdQZxE51g6EHCdGHYeUsBBP-xTEQcppjunDu7-4caPN4YQ6hXwfETM7F-OBYT42kXI_OcLC3GDTgGw8mhWu",
  },
  {
    id: 3,
    name: "Phạm Hoàng L",
    role: "Học sinh tiểu học",
    content:
      "Con thấy học rất dễ hiểu và không bị áp lực. Con thích nhất là thầy cô luôn động viên con cố gắng.",
    rating: 5,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuACL2nv_p5u3u_0OSk3sgjJeysdu6hQEVPgCqcWA3ciFnrjlluPPYEMFuxrN4qcAiwyF8OUqMx_D_it5UL_r2DPDnf41O3kbR6F9QJxP-13kikxWVw6gu5jwx5T0tyZnqpI5h5baqVBfmTfdEnA4Nod5EFbst2YC7sfgcNDCmKWb8suYdje-7V2tKOopl5KkcXGM6G45pM5yDajEAOFKGc_D9b3egsowk31muJvze3FCLmfNdYX1CYYRvRLDjmTS2ICHLMUpIQ0IUog",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="bg-[#F8F9FA] py-24">
      <div className="max-w-[1280px] mx-auto px-10">
        <ScrollReveal variant={fadeInUp} className="text-center mb-16">
          <span className="color-primary font-bold tracking-widest text-sm uppercase">
            Cảm nhận từ học sinh
          </span>
          <h2 className="sm:text-4xl text-2xl font-extrabold text-gray-900 mt-2 max-w-3xl mx-auto">
            Hơn 1,000 học sinh đã thay đổi tương lai cùng IES EDU
          </h2>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.id}>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-start hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#0077BE]/10"
                    src={testimonial.image}
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, index) => (
                    <FaStar key={index} className="text-[18px]" />
                  ))}
                </div>

                <p className="text-gray-600 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default TestimonialsSection;
