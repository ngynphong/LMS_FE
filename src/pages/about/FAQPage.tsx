import { useState } from "react";
import {
  ScrollReveal,
  fadeInUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/ScrollReveal";
import { MdCampaign, MdExpandMore, MdSupportAgent } from "react-icons/md";
import { IoCall, IoMail, IoPerson, IoSchool } from "react-icons/io5";

const categories = [
  { id: "courses", name: "Về Khóa Học", icon: <IoSchool /> },
  { id: "account", name: "Về Tài Khoản", icon: <IoPerson /> },
  { id: "technical", name: "Kỹ Thuật & Hỗ Trợ", icon: <MdSupportAgent /> },
  { id: "instructor", name: "Về Giảng Viên", icon: <MdCampaign /> },
];

const faqs = [
  // I. VỀ KHÓA HỌC
  {
    category: "courses",
    q: "IES Focus cung cấp những loại khóa học nào?",
    a: "IES Focus cung cấp các khóa học trong lĩnh vực khoa học công nghệ thực chiến và lộ trình nghề nghiệp chuẩn quốc tế, bao gồm: lập trình, thiết kế, khoa học dữ liệu, marketing số, kỹ năng khởi nghiệp và nhiều chủ đề công nghệ hiện đại khác.",
  },
  {
    category: "courses",
    q: "Học tại IES Focus có mất phí không?",
    a: "HOÀN TOÀN MIỄN PHÍ! Tất cả khóa học trên IES Focus đều được cung cấp miễn phí cho học viên đã đăng ký tài khoản. Sứ mệnh của chúng tôi là nâng tầm tri thức Việt không rào cản tài chính.",
  },
  {
    category: "courses",
    q: "Ai có thể học tại IES Focus?",
    a: "Tất cả mọi người từ 13 tuổi trở lên đều có thể đăng ký học tại IES Focus. Dù bạn là người mới bắt đầu, học sinh, sinh viên hay người đi làm muốn nâng cao kỹ năng, chúng tôi đều có chương trình phù hợp.",
  },
  {
    category: "courses",
    q: "Tôi học trực tuyến hay trực tiếp?",
    a: "IES Focus cung cấp hình thức học trực tuyến hoàn toàn qua nền tảng iesfocus.edu.vn. Bạn có thể học mọi lúc, mọi nơi theo tiến độ cá nhân. Một số khóa học đặc biệt có thể có buổi học theo lịch cố định - thông tin sẽ được ghi rõ trong mô tả khóa học.",
  },
  {
    category: "courses",
    q: "Tôi có nhận được chứng chỉ sau khi hoàn thành không?",
    a: "Có. Học viên hoàn thành đủ yêu cầu của khóa học sẽ được cấp chứng chỉ hoàn thành điện tử từ IES Focus. Chứng chỉ có thể tải xuống và dùng để bổ sung vào hồ sơ năng lực cá nhân hoặc LinkedIn.",
  },
  // II. VỀ TÀI KHOẢN
  {
    category: "account",
    q: "Làm thế nào để đăng ký và bắt đầu học?",
    a: (
      <div className="space-y-2">
        <p>Thực hiện quy trình 4 bước đơn giản:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Bước 1:</strong> Truy cập iesfocus.edu.vn và nhấn 'Bắt đầu
            học'.
          </li>
          <li>
            <strong>Bước 2:</strong> Điền thông tin đăng ký và xác nhận email.
          </li>
          <li>
            <strong>Bước 3:</strong> Tìm kiếm và chọn khóa học phù hợp.
          </li>
          <li>
            <strong>Bước 4:</strong> Nhấn 'Đăng ký' và bắt đầu học ngay!
          </li>
        </ul>
      </div>
    ),
  },
  {
    category: "account",
    q: "Tôi quên mật khẩu, phải làm thế nào?",
    a: "Trên trang đăng nhập, nhấn vào 'Quên mật khẩu', nhập địa chỉ email đã đăng ký và làm theo hướng dẫn trong email được gửi đến. Nếu không nhận được email, hãy kiểm tra hộp thư spam hoặc liên hệ hỗ trợ.",
  },
  {
    category: "account",
    q: "Tôi có thể học trên điện thoại không?",
    a: "Có. Bạn có thể học trên máy tính (Windows, macOS), điện thoại thông minh và máy tính bảng (iOS, Android) thông qua trình duyệt web. Đảm bảo thiết bị có kết nối internet ổn định để có trải nghiệm tốt nhất.",
  },
  // III. KỸ THUẬT & HỖ TRỢ
  {
    category: "technical",
    q: "Video bị lag hoặc không phát được, phải làm gì?",
    a: (
      <div className="space-y-2">
        <p>Vui lòng thử các bước sau:</p>
        <ul className="list-decimal pl-5 space-y-1">
          <li>Kiểm tra kết nối internet.</li>
          <li>Xóa cache trình duyệt.</li>
          <li>Thử dùng trình duyệt khác như Chrome hoặc Firefox.</li>
          <li>Giảm chất lượng video.</li>
        </ul>
        <p>Nếu vẫn gặp sự cố, hãy liên hệ hỗ trợ qua email hoặc hotline.</p>
      </div>
    ),
  },
  {
    category: "technical",
    q: "Làm thế nào để liên hệ hỗ trợ?",
    a: (
      <div className="space-y-2">
        <p>Bạn có thể liên hệ với chúng tôi qua:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Email:</strong> infovienies@gmail.com (phản hồi trong 24h
            làm việc)
          </li>
          <li>
            <strong>Hotline:</strong> 0965 248 115 (Thứ Hai - Thứ Sáu,
            8:00-17:30)
          </li>
          <li>Diễn đàn học viên trực tiếp trên nền tảng.</li>
        </ul>
      </div>
    ),
  },
  // IV. VỀ GIẢNG VIÊN
  {
    category: "instructor",
    q: "Tôi có thể trở thành giảng viên tại IES Focus không?",
    a: "Có! IES Focus luôn chào đón các chuyên gia và giảng viên có chuyên môn muốn chia sẻ kiến thức. Truy cập mục 'Trở thành giảng viên' trên website hoặc gửi email về infovienies@gmail.com.",
  },
  {
    category: "instructor",
    q: "Giảng viên được hỗ trợ gì từ IES Focus?",
    a: "IES Focus hỗ trợ giảng viên về kỹ thuật sản xuất nội dung, công cụ quản lý khóa học, kết nối với cộng đồng học viên và các chương trình đặc biệt để mở rộng tầm ảnh hưởng trong cộng đồng giáo dục công nghệ.",
  },
];

const FAQItem = ({ faq, index }: { faq: any; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <StaggerItem className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-blue-600 transition-colors group"
      >
        <span className="text-base lg:text-lg font-bold text-slate-800 group-hover:text-blue-600">
          {index + 1}. {faq.q}
        </span>
        <span
          className={`text-xl transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-600" : "text-slate-400"}`}
        >
          <MdExpandMore />
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[500px] mb-6" : "max-h-0"}`}
      >
        <div className="text-slate-600 leading-relaxed text-sm lg:text-base pr-8">
          {faq.a}
        </div>
      </div>
    </StaggerItem>
  );
};

const FAQPage = () => {
  const [activeTab, setActiveTab] = useState("courses");

  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Lexend',sans-serif] pb-20">
      {/* Header Section */}
      <section className="bg-white border-b border-slate-200 py-16 lg:py-24 relative overflow-hidden">
        {/* Chips decorative */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50" />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
          <ScrollReveal variant={fadeInUp} className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest border border-blue-100 mb-6">
              Hỗ trợ học viên
            </div>
            <h1 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight mb-4">
              Câu Hỏi Thường Gặp
            </h1>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">
              Tìm câu trả lời cho những thắc mắc phổ biến về khóa học, tài khoản
              và các vấn đề kỹ thuật tại IES Focus.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-12">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all border ${
                  activeTab === cat.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <ScrollReveal
            variant={fadeInUp}
            className="bg-white rounded-3xl p-6 lg:p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border border-slate-100"
          >
            <StaggerContainer>
              {faqs
                .filter((faq) => faq.category === activeTab)
                .map((faq, index) => (
                  <FAQItem key={index} faq={faq} index={index} />
                ))}
            </StaggerContainer>
          </ScrollReveal>

          {/* Contact Support */}
          <div className="mt-16 text-center">
            <p className="text-slate-500 mb-6 font-medium italic">
              Bạn vẫn còn thắc mắc khác?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
                href="mailto:infovienies@gmail.com"
                className="group flex items-center gap-3 bg-white px-8 py-4 rounded-2xl border-2 border-slate-100 hover:border-blue-600 transition-all"
              >
                <div className="size-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <span className="">
                    <IoMail />
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Gửi Email hỗ trợ
                  </div>
                  <div className="font-bold text-slate-900">
                    infovienies@gmail.com
                  </div>
                </div>
              </a>
              <div className="group flex items-center gap-3 bg-white px-8 py-4 rounded-2xl border-2 border-slate-100 hover:border-blue-600 transition-all">
                <div className="size-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <span className="">
                    <IoCall />
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Hotline 24/7
                  </div>
                  <div className="font-bold text-slate-900">0965 248 115</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
