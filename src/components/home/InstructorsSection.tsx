import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  fadeInUp,
} from "../ui/ScrollReveal";

interface Instructor {
  id: number;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  image: string;
  exp: string;
  goal: string;
}

const instructors: Instructor[] = [
  {
    id: 1,
    name: "TS. Tô Hoài Thắng - Viện trưởng",
    title: "Tiến sĩ chuyên ngành Quản trị Kinh doanh",
    rating: 4.9,
    reviews: 128,
    image: "/img/thay-thang-avatar.jpg",
    exp: "10 năm kinh nghiệm trong vai trò quản lý khoa và viện đào tạo Sau Đại học.",
    goal: "3 Đề tài nghiên cứu khoa học công bố trong nước và quốc tế.",
  },
  {
    id: 2,
    name: "ThS. Vũ Huy Hoàng",
    title: "Thạc sĩ chuyên ngành Quản trị Kinh doanh",
    rating: 4.9,
    reviews: 85,
    image: "/img/huy-hoang-avatar.jpg",
    exp: "Giảng viên AI Trường Quản trị & Công nghệ FSB Đại học FPT ",
    goal: "Là Founder và CEO công ty truyền thông Hmedia",
  },
  {
    id: 3,
    name: "ThS. Nguyễn Thanh Điềm",
    title: "Thạc sĩ chuyên ngành Công nghệ Sinh học",
    rating: 4.8,
    reviews: 210,
    image: "/img/thanh-diem-avatar.jpg",
    exp: "Hướng dẫn sinh viên thực hiện đề tài nghiên cứu nhỏ và đồ án tốt nghiệp liên quan đến vi sinh vật và ứng dụng sinh học.",
    goal: "Tham gia giảng dạy các học phần: Vi sinh vật học, Công nghệ sinh học ứng dụng, Sinh học phân tử cơ bản.",
  },
];

const InstructorsSection = () => {
  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-[1280px] mx-auto px-10">
        <ScrollReveal
          variant={fadeInUp}
          className="flex items-end justify-between mb-16"
        >
          <div className="flex flex-col gap-2">
            <span className="color-primary font-bold tracking-widest text-sm uppercase">
              Chuyên gia
            </span>
            <h2 className="sm:text-4xl text-2xl font-extrabold text-gray-900">
              Đội ngũ Giảng viên hàng đầu
            </h2>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {instructors.map((instructor) => (
            <StaggerItem key={instructor.id}>
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
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
                <p className="text-gray-600 leading-relaxed italic">
                  "{instructor.exp}"
                </p>
                {/* <p className="text-gray-600 leading-relaxed italic">
                  "{instructor.goal}"
                </p> */}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default InstructorsSection;
