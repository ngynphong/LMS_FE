import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";

const Breadcrumb = () => {
  return (
    <div className="flex flex-wrap gap-2 py-4">
      <Link className="text-gray-500 text-sm font-medium flex items-center gap-1 hover:text-[#0077BE]" to="/">
        <span className="material-symbols-outlined text-sm"><FaHome/></span> Trang chủ
      </Link>
      <span className="text-gray-500 text-sm font-medium">/</span>
      <span className="text-[#0077BE] text-sm font-semibold">Tất cả khóa học</span>
    </div>
  );
};

export default Breadcrumb;
