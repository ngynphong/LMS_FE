import { FaArrowRight, FaStar } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="w-full bg-cyan-50/30 py-16">
      <div className="max-w-[1280px] mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-[#0077BE]/10 text-[#0077BE] px-3 py-1 rounded-full w-fit">
            <span className="bg-[#0077BE] text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase">
              Mới
            </span>
            <span className="text-sm font-semibold">
              Khóa học thiết kế vừa ra mắt!
            </span>
            <span className="material-symbols-outlined text-sm">
              <FaArrowRight />
            </span>
          </div>

          <h1 className="text-slate-900 text-3xl lg:text-5xl font-black leading-[1.1] tracking-tight">
            Viện Khoa Học <br />
            <p
              className="text-[#0077BE]"
              style={{ textShadow: "0 0 15px rgba(0, 119, 190, 0.4)" }}
            >
              Sáng Tạo
            </p>{" "}
            &
            <p className="px-4 py-1 rounded-2xl inline-block text-[#005a91]">
              Khởi Nghiệp
            </p>
          </h1>

          <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
            Kiến tạo tương lai thông qua giáo dục khai phóng và ứng dụng công
            nghệ đột phá. Chúng tôi đồng hành cùng bạn trên con đường chinh phục
            đỉnh cao tri thức.
          </p>

          <div className="flex flex-wrap gap-4 mt-2">
            <Link
              to="/courses"
              className="bg-[#0077BE] text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-[#0077BE]/30 hover:bg-[#0077BE]/90 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined"></span> Khám phá khóa
              học
            </Link>
            <Link
              to="/contact"
              className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">
                <FaCalendarAlt />
              </span>{" "}
              Đặt lịch tư vấn
            </Link>
          </div>

          <div className="flex items-center gap-4 mt-4 bg-white/50 p-2 rounded-2xl w-fit">
            <div className="flex -space-x-3">
              <img
                alt="Student"
                className="w-10 h-10 rounded-full border-2 border-white"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALNti7aymXiKX0TlrB2nTKflobYTAgvBV7vLhafEAPDTv7Ghvt4T_w0tWXHuJ9FoPGA8lgU7kwYuaUr6_5nBN0T2ldahG7ffkTrI6zs85o0qFQo9OPIfiKg7iftx6SCO3H8joiSg66_aWAwbtxNFvRPJyxHxaYzp6D9qaDETaSZsM7OmsNGlUy6xvpLOIJfFfeTNDpxTMbNvgHNWF2fYsmCN8lhH8I2-rgI0pS0Y3Yk0HuoCodTTa19jG4Q0eHdiu5cChXCd8ZflRU"
              />
              <img
                alt="Student"
                className="w-10 h-10 rounded-full border-2 border-white"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEAZNdV59tM24ZyPQtutC0DsV5iPwbbVXqNSv_xHTAvjCVZ5ZlvneBg51omybsDKWkby5kUM93hspPnxHgZehh7LJNIztxRzJhFZ33vuoXXL89PyUOS_psF0zAjL18LtaBAhygZCgCH9BFwbpu2deWXzvllQaHEQCshCMdDMPKaqwEsMmwO64FfoClwOdQZxE51g6EHCdGHYeUsBBP-xTEQcppjunDu7-4caPN4YQ6hXwfETM7F-OBYT42kXI_OcLC3GDTgGw8mhWu"
              />
              <img
                alt="Student"
                className="w-10 h-10 rounded-full border-2 border-white"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuACL2nv_p5u3u_0OSk3sgjJeysdu6hQEVPgCqcWA3ciFnrjlluPPYEMFuxrN4qcAiwyF8OUqMx_D_it5UL_r2DPDnf41O3kbR6F9QJxP-13kikxWVw6gu5jwx5T0tyZnqpI5h5baqVBfmTfdEnA4Nod5EFbst2YC7sfgcNDCmKWb8suYdje-7V2tKOopl5KkcXGM6G45pM5yDajEAOFKGc_D9b3egsowk31muJvze3FCLmfNdYX1CYYRvRLDjmTS2ICHLMUpIQ0IUog"
              />
              <img
                alt="Student"
                className="w-10 h-10 rounded-full border-2 border-white"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMZLLN1l6ZYLK7ZggKoRj9AoQNWMrJSsyJ4dpjFB_ITjPm6fCPdNlWFXBOEcRcMBdmuxMtvMrVI7hHHKrQL42okO0gg0pybWgAcJ-dqolEiKAAs0Rc0ZSFtmq2Jccy0rDFesrD4f3DOHOJkbnmoONX29W2oQR8qo01SGFG_wfWINbCOTMTsj13gq0qy_ReyDO32HH5ZZ0N8W6dJLxBx2IEp9iAnO0BuLSsrt_7KctkxSy0Tjs3TYAtPRpMcw9LY18g-uWi5QA6mvpj"
              />
              <div className="w-10 h-10 rounded-full border-2 border-white bg-[#0077BE] text-white text-[10px] flex items-center justify-center font-bold">
                +50
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex text-yellow-500">
                <span className="material-symbols-outlined text-sm FILL">
                  <FaStar />
                </span>
                <span className="material-symbols-outlined text-sm FILL">
                  <FaStar />
                </span>
                <span className="material-symbols-outlined text-sm FILL">
                  <FaStar />
                </span>
                <span className="material-symbols-outlined text-sm FILL">
                  <FaStar />
                </span>
                <span className="material-symbols-outlined text-sm FILL">
                  <FaStar />
                </span>
              </div>
              <span className="text-sm text-gray-600 font-medium">
                Được tin dùng bởi 2,500+ học viên
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="relative z-10 w-full aspect-4/5 bg-[#E9EDF2] rounded-[40px] overflow-hidden">
            <img
              alt="Student studying"
              className="w-full h-full object-cover"
              src="/hero-img.png"
            />
          </div>

          <div
            className="absolute -top-10 -left-10 w-32 h-32 bg-[#0077BE]/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-[#0077BE]/30 z-20 animate-bounce"
            style={{ animationDuration: "3s" }}
          >
            <div className="bg-[#0077BE] text-white w-24 h-24 rounded-full flex flex-col items-center justify-center text-center p-2 border-4 border-white shadow-xl">
              <span className="text-xs font-bold leading-tight">Hơn</span>
              <span className="text-lg font-black">500+</span>
              <span className="text-[8px] uppercase tracking-widest font-bold">
                Khóa học
              </span>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-6 lg:-right-12 bg-white p-5 rounded-2xl shadow-2xl z-20 border border-gray-100 min-w-[240px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                  ● Tiến độ học tập
                </span>
                <span className="text-sm font-bold text-gray-800">
                  Cải thiện trình độ
                </span>
              </div>
              <div className="bg-blue-100 text-[#0077BE] p-1.5 rounded-lg">
                <span className="material-symbols-outlined text-lg">
                  rocket_launch
                </span>
              </div>
            </div>
            <div className="h-16 w-full flex items-end gap-1 mb-2">
              <div className="bg-gray-100 w-full h-[40%] rounded-t-sm"></div>
              <div className="bg-gray-100 w-full h-[60%] rounded-t-sm"></div>
              <div className="bg-[#0077BE]/40 w-full h-[30%] rounded-t-sm"></div>
              <div className="bg-[#0077BE]/60 w-full h-[70%] rounded-t-sm"></div>
              <div className="bg-[#0077BE] w-full h-full rounded-t-sm"></div>
              <div className="bg-[#0077BE]/80 w-full h-[85%] rounded-t-sm"></div>
              <div className="bg-[#0077BE] w-full h-full rounded-t-sm relative">
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">
                Tăng tốc ngay
              </span>
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[14px]">
                  bolt
                </span>
              </span>
            </div>
          </div>

          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#0077BE]/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
