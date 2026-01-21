import { MdSchedule } from "react-icons/md";
import { MdVerified } from "react-icons/md";
import { TbCertificate } from "react-icons/tb";

const features = [
  {
    id: 1,
    icon: <MdSchedule />,
    title: 'Học linh hoạt',
    description: 'Học mọi lúc, mọi nơi với lộ trình học tập được cá nhân hóa, phù hợp với thời gian biểu của bạn.'
  },
  {
    id: 2,
    icon: <MdVerified />,
    title: 'Giảng viên uy tín',
    description: 'Đội ngũ chuyên gia giàu kinh nghiệm thực chiến từ các tập đoàn công nghệ lớn hàng đầu.'
  },
  {
    id: 3,
    icon: <TbCertificate />,
    title: 'Chứng chỉ giá trị',
    description: 'Nhận chứng chỉ hoàn thành khóa học có giá trị chuyên môn, được công nhận bởi các nhà tuyển dụng.'
  }
];

const FeaturesSection = () => {
  return (
    <section className="w-full bg-blue-50/30 py-24">
      <div className="max-w-[1280px] mx-auto px-10">
        <div className="text-center mb-16">
          <span className="text-[#0077BE] font-bold tracking-widest text-sm uppercase">Ưu điểm</span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Tại sao chọn chúng tôi?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature) => (
            <div key={feature.id} className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-[#0077BE]/10 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#0077BE] text-4xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
