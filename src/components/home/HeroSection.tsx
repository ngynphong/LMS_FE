import {
  FaArrowRight,
  FaStar, 
  FaBolt,
  FaRocket,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { ScrollReveal, fadeInLeft, fadeInRight } from "../ui/ScrollReveal";

const HeroSection = () => {
  return (
    <section className="w-full bg-cyan-50/30 py-10 lg:py-16 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <ScrollReveal
          variant={fadeInLeft}
          className="flex flex-col gap-6 order-2 lg:order-1"
        >
          {" "}
          <div className="inline-flex items-center gap-2 color-primary px-3 py-1 rounded-full w-fit">
            <span className="color-primary-bg text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase shrink-0">
              Mới
            </span>
            <span className="text-xs sm:text-sm font-semibold truncate max-w-[200px] sm:max-w-none">
              Khóa học thiết kế vừa ra mắt!
            </span>
            <span className="text-sm">
              <FaArrowRight />
            </span>
          </div>
          <h1 className="text-slate-900 text-start text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.2] lg:leading-[1.1] tracking-tight">
            Viện Khoa Học Sáng Tạo Khởi Nghiệp
          </h1>
          <p className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-xl">
            Kiến tạo tương lai thông qua giáo dục khai phóng và ứng dụng công
            nghệ đột phá. Chúng tôi đồng hành cùng bạn trên con đường chinh phục
            đỉnh cao tri thức.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto">
            <Link
              to="/courses"
              className="color-primary-bg text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-[#0077BE]/30 transition-all hover:opacity-80 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Khám phá khóa học
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4 bg-white/60 backdrop-blur-sm p-3 border border-white/50 rounded-2xl w-fit">
            <div className="flex -space-x-3">
              {[0, 1, 2, 3].map((i) => (
                <img
                  key={i}
                  alt="Student"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover"
                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                />
              ))}
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white color-primary text-white text-[10px] flex items-center justify-center font-bold">
                +50
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex text-yellow-500 text-xs sm:text-sm">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">
                1,000+ học viên tin dùng
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* --- CỘT ẢNH (IMAGE WRAPPER) --- */}
        <ScrollReveal
          variant={fadeInRight}
          className="relative order-1 lg:order-2 px-4 sm:px-0"
        >
          <div
            className="relative z-10 w-full bg-[#E9EDF2] rounded-[30px] sm:rounded-[40px] overflow-hidden shadow-2xl border-4 border-white"
            style={{ aspectRatio: "4/5" }}
          >
            <img
              alt="Student studying"
              className="w-full h-full object-cover"
              src="/img/hero-img.png"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/img/hero-img.png";
              }}
            />
          </div>

          {/* Badge tròn góc trên trái */}
          <div
            className="absolute -top-4 -left-2 sm:-top-8 sm:-left-10 w-16 h-16 sm:w-26 sm:h-26 color-primary/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-[#0077BE]/30 z-20 animate-bounce"
            style={{ animationDuration: "4s" }}
          >
            <div className="color-primary-bg text-white w-14 h-14 sm:w-22 sm:h-22 rounded-full flex flex-col items-center justify-center text-center p-1 sm:p-2 border-4 border-white shadow-xl">
              <span className="text-[8px] sm:text-xs font-bold leading-tight">
                Hơn
              </span>
              <span className="text-xs sm:text-sm font-black">500+</span>
              <span className="text-[5px] sm:text-[8px] uppercase tracking-widest font-bold">
                Khóa học
              </span>
            </div>
          </div>

          {/* Card tiến độ góc dưới phải */}
          <div className="absolute -bottom-8 -right-2 sm:-bottom-6 sm:-right-6 lg:-right-12 bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-2xl z-20 border border-gray-100 w-[200px] sm:min-w-[240px] transform scale-90 sm:scale-100 origin-bottom-right">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="flex flex-col">
                <span className="text-[8px] sm:text-[10px] font-bold text-red-500 uppercase tracking-wider">
                  ● Tiến độ
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-800">
                  Cải thiện
                </span>
              </div>
              <div className="bg-blue-100 color-primary p-1 rounded-lg">
                <FaRocket className="text-sm sm:text-lg" />
              </div>
            </div>

            {/* Chart Bars */}
            <div className="h-10 sm:h-16 w-full flex items-end gap-1 mb-2">
              <div className="bg-gray-100 w-full h-[40%] rounded-t-sm"></div>
              <div className="bg-gray-100 w-full h-[60%] rounded-t-sm"></div>
              <div className="color-primary-bg w-full h-[30%] rounded-t-sm"></div>
              <div className="color-primary-bg w-full h-[70%] rounded-t-sm"></div>
              <div className="color-primary-bg w-full h-full rounded-t-sm"></div>
              <div className="color-primary-bg w-full h-[85%] rounded-t-sm"></div>
              <div className="color-primary-bg w-full h-full rounded-t-sm relative">
                <div className="absolute -top-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-ping"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold text-gray-500">
                Tăng tốc ngay
              </span>
              <span className="bg-blue-600 text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center">
                <FaBolt className="text-[10px] sm:text-[14px]" />
              </span>
            </div>
          </div>

          {/* Background Blur Effect - Giữ nguyên nhưng đảm bảo z-index thấp */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] color-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default HeroSection;
