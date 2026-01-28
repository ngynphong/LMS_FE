import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

interface Instructor {
  id: number;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  image: string;
}

const instructors: Instructor[] = [
  {
    id: 1,
    name: "TS. Trần Văn B",
    title: "Chuyên gia AI",
    rating: 4.9,
    reviews: 128,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB8kBEgVzs2G0kh7zzWUQ1HeMJArc2A2YMj1A3Bz0i91emkpmCFVTH6QnXdZQ0y4OrHZd9oGCCnC0LEBnWzCn_7cmAJE-tEPqItu3iJKGKGr0fE7h2zdOeT_DQMBMZVh9Mlpz9vSCercHxGNMNK3hJMz4fEC73WfyQMcgjZD6ska1Zcp_ml-pCqRUZWBpY-NCwIYQNFSFvbDMcDC4CBkzrMBBgHL_hpj95RRqsElVkgccXPE9RNi89z5lzmBYx5LJ3RAa-f-tVgR90w",
  },
  {
    id: 2,
    name: "ThS. Lê Thị D",
    title: "Lead UI/UX Designer",
    rating: 4.9,
    reviews: 85,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAbZbalkEbVISe4Z6h1tHY1oZxp03UR4_VtAp_5WI5xb1KeKTxYDbr3ARRxagcYIe9RvyYVO-zaY-kL0VM93um7UQxNO_76TknHBwW6V5KirAgmLcsCwH8xLpEVVkwHmhw_RN5-_7566-twPb_IymudonMvdHpjn90Ltr_TpgBMS1GzdGp5dcLqmUcPDoSgoM9EySHYjzEKjaqtC_ifD-d8gQHebEER-nifnR8XQ9iHsL5dk6XiuZFTU4C83A19XnU9MpumZWGE9vxd",
  },
  {
    id: 3,
    name: "Kỹ sư. Nguyễn An",
    title: "Senior Web Developer",
    rating: 4.8,
    reviews: 210,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDuRlxYZlpZvcoT1Yuf_cRskqI4sTJmWXRpHRUJcdtgLWPC7IWZ-4ARv3fpFfnc7EUrOG-tX9XHjz33ckmDoQCGgZOd4mOZhUXTszSJZwsyEmCdx8RpMCMOrwKZ4fP_NipCPWvUCyi6eCvYMH_xLkzTgx_84qqN6Fhnc56vlb9y8UKBgDKCLNkyekvmyWdSb-K-Um45a1M4dgi5nmWjyNGa2sUFB3A6MOj4g3hR5sHJErZWWpzSlngWom-04o2F0gwz2P_gSrej81eT",
  },
  {
    id: 4,
    name: "TS. Phạm Minh H",
    title: "Chuyên gia Big Data",
    rating: 4.9,
    reviews: 94,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBMPnsg1AdawuYt7WYBz4S1btH5_0iYRWbglJYMZdPivsvZMXeNOxXVd6Rj8axGvyv9Tpni_D8iMIPIFIp6NNJSXMOYe-85o1qfYO9tiQTfxPuXRQHhN9leyvq7xcIJ46IUfpBHpoVPkrcc9wYlnMFmuo-tsxMwA29pk3mVe_rY3CfNpOnFqYufiAhCWXJqUTIKjsyfVwKeUh92ArBYRZHSebx4YGLNpw2hN3hUG3B3oBmEr3qaHsYUh8f5j1Tjor52UYmR3lxdkl2_",
  },
];

const InstructorsSection = () => {
  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-[1280px] mx-auto px-10">
        <div className="flex items-end justify-between mb-16">
          <div className="flex flex-col gap-2">
            <span className="color-primary font-bold tracking-widest text-sm uppercase">
              Chuyên gia
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900">
              Đội ngũ Giảng viên hàng đầu
            </h2>
          </div>
          <button className="px-6 py-3 rounded-xl border-2 border-gray-100 font-bold text-gray-600 hover:bg-gray-50 transition-colors">
            Tất cả giảng viên
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {instructors.map((instructor) => (
            <div
              key={instructor.id}
              className="bg-white p-8 rounded-[32px] border border-gray-100 text-center hover:shadow-xl transition-all group"
            >
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 color-primary/5 rounded-full scale-110 group-hover:scale-125 transition-transform duration-500"></div>
                <img
                  alt={instructor.name}
                  className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg relative z-10"
                  src={instructor.image}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {instructor.name}
              </h3>
              <p className="color-primary font-semibold text-sm mb-3">
                {instructor.title}
              </p>
              <div className="flex items-center justify-center gap-1 mb-6">
                <span className="material-symbols-outlined text-yellow-400 text-sm FILL">
                  <FaStar />
                </span>
                <span className="text-gray-700 font-bold text-sm">
                  {instructor.rating}/5
                </span>
                <span className="text-gray-400 text-xs">
                  ({instructor.reviews} đánh giá)
                </span>
              </div>
              <Link
                className="inline-block color-primary font-bold text-sm hover:underline"
                to={`/instructor/${instructor.id}`}
              >
                Xem hồ sơ
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstructorsSection;
