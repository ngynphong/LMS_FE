import { MdVerified } from "react-icons/md";
import { TbCertificate } from "react-icons/tb";
import { Clock5 } from "../animate-ui/icons/clock-5";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  fadeInUp,
} from "../ui/ScrollReveal";

const features = [
  {
    id: 1,
    icon: <Clock5 animateOnHover size={24} />,
    title: "Học linh hoạt",
    description:
      "Học mọi lúc, mọi nơi với lộ trình học tập được cá nhân hóa, phù hợp với thời gian biểu của bạn.",
  },
  {
    id: 2,
    icon: <MdVerified />,
    title: "Giảng viên uy tín",
    description:
      "Đội ngũ chuyên gia giàu kinh nghiệm thực chiến từ các tập đoàn công nghệ lớn hàng đầu.",
  },
  {
    id: 3,
    icon: <TbCertificate />,
    title: "Chứng chỉ giá trị",
    description:
      "Nhận chứng chỉ hoàn thành khóa học có giá trị chuyên môn, được công nhận bởi các nhà tuyển dụng.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="w-full bg-blue-50/30 py-24">
      <div className="max-w-[1280px] mx-auto px-10">
        <ScrollReveal variant={fadeInUp} className="text-center mb-16">
          <span className="color-primary font-bold tracking-widest text-sm uppercase">
            Ưu điểm
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-2">
            Tại sao chọn chúng tôi?
          </h2>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature) => (
            <StaggerItem key={feature.id}>
              <div className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="w-16 h-16 color-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined color-primary text-4xl">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default FeaturesSection;
