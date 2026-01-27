import { CiMail } from 'react-icons/ci';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { IoIosCall } from 'react-icons/io';
import { FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-[#0f172a] text-white py-16 px-10">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-[#0077BE]">
            <span className="text-4xl">
              <img
                src="/logo-edu.png"
                alt="ies-edu-logo"
                className="w-12 h-12"
              />
            </span>
            <h2 className="text-white text-2xl font-bold">IES Edu</h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Nâng tầm tri thức Việt qua các khóa học công nghệ thực chiến và lộ
            trình nghề nghiệp chuẩn quốc tế.
          </p>
          <div className="flex gap-4">
            <Link
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#0077BE] transition-colors"
              to="#"
            >
              <span className="material-symbols-outlined text-sm">
                <FaFacebookF />
              </span>
            </Link>
            <Link
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#0077BE] transition-colors"
              to="#"
            >
              <span className="material-symbols-outlined text-sm">
                <FaYoutube />
              </span>
            </Link>
            <Link
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#0077BE] transition-colors"
              to="#"
            >
              <span className="material-symbols-outlined text-sm">
                <FaInstagram />
              </span>
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-6">Liên kết nhanh</h3>
          <ul className="flex flex-col gap-3 text-gray-400 text-sm">
            <li>
              <Link
                className="hover:text-white transition-colors"
                to="/courses"
              >
                Khám phá khóa học
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-white transition-colors"
                to="/become-instructor"
              >
                Trở thành giảng viên
              </Link>
            </li>
            <li>
              <Link className="hover:text-white transition-colors" to="/about">
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link className="hover:text-white transition-colors" to="/news">
                Tin tức công nghệ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-6">Chính sách</h3>
          <ul className="flex flex-col gap-3 text-gray-400 text-sm">
            <li>
              <Link className="hover:text-white transition-colors" to="/terms">
                Điều khoản dịch vụ
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-white transition-colors"
                to="/privacy"
              >
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link className="hover:text-white transition-colors" to="/refund">
                Chính sách hoàn tiền
              </Link>
            </li>
            <li>
              <Link className="hover:text-white transition-colors" to="/faq">
                Câu hỏi thường gặp
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-6">Liên hệ</h3>
          <ul className="flex flex-col gap-4 text-gray-400 text-sm">
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#0077BE]">
                <CiMail />
              </span>
              infovienies@gmail.com
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#0077BE]">
                <IoIosCall />
              </span>
              0965248115
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#0077BE]">
                <FaLocationDot />
              </span>
              <span>
                Số 3 Công Trường Quốc Tế , Phường Xuân Hoà, Thành phố Hồ Chí
                Minh.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto mt-16 pt-8 border-t border-white/5 text-center text-gray-500 text-xs">
        <p>© 2026 IES Edu. Kiến tạo tương lai số. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
