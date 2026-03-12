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
  role: string;
}

const instructors: Instructor[] = [
  {
    id: 1,
    name: "TS. Tô Hoài Thắng",
    role: "Viện trưởng",
    title: "Tiến sĩ chuyên ngành Quản trị Kinh doanh",
    rating: 4.9,
    reviews: 128,
    image: "/img/thay-thang-avatar.jpg",
    exp: "10 năm kinh nghiệm trong vai trò quản lý khoa và viện đào tạo Sau Đại học.",
    goal: "3 Đề tài nghiên cứu khoa học công bố trong nước và quốc tế.",
  },
  {
    id: 2,
    name: "TS. Đào Lê Hòa An",
    role: "Phó Viện trưởng",
    title: "Diễn giả nổi tiếng về lĩnh vực Tâm lý học ứng dụng.",
    rating: 4.8,
    reviews: 210,
    image: "/img/hoa-an-avatar.jpg",
    exp: "Chuyên gia tâm lý trên các kênh truyền hình như VTV, HTV",
    goal: "TS. Đào Lê Hòa An cũng đạt nhiều thành tích nổi bật như Quán quân Tri thức trẻ vì giáo dục 2020, Quán quân I-STAR 2021, Quán quân Tuổi Trẻ Golf Tournament for Start-up 2022, cùng nhiều giải thưởng và đóng góp trong lĩnh vực giáo dục, khởi nghiệp và phát triển thanh niên.",
  },
  {
    id: 3,
    name: "ThS. Vũ Huy Hoàng",
    role: "Phó Viện trưởng",
    title: "Thạc sĩ chuyên ngành Quản trị Kinh doanh",
    rating: 4.9,
    reviews: 85,
    image: "/img/huy-hoang-avatar.jpg",
    exp: "Giảng viên AI Trường Quản trị & Công nghệ FSB Đại học FPT ",
    goal: "Là Founder và CEO công ty truyền thông Hmedia",
  },
  {
    id: 4,
    name: "ThS. Nguyễn Thị Huỳnh Giao",
    role: "Phó Viện trưởng",
    title: "Nhà Báo",
    rating: 4.9,
    reviews: 85,
    image: "/img/huynh-giao-avatar.jpg",
    exp: "Là nhà báo có kinh nghiệm trong lĩnh vực truyền thông và giáo dục.",
    goal: "Với vai trò Phó Viện trưởng, cô phụ trách phát triển nội dung, hoạt động truyền thông và kết nối các chương trình giáo dục của Viện.",
  },

  {
    id: 5,
    name: "ThS. Nguyễn Thanh Điềm",
    role: "Giảng viên",
    title: "Thạc sĩ chuyên ngành Công nghệ Sinh học",
    rating: 4.8,
    reviews: 210,
    image: "/img/thanh-diem-avatar.jpg",
    exp: "Hướng dẫn sinh viên thực hiện đề tài nghiên cứu nhỏ và đồ án tốt nghiệp liên quan đến vi sinh vật và ứng dụng sinh học.",
    goal: "Tham gia giảng dạy các học phần: Vi sinh vật học, Công nghệ sinh học ứng dụng, Sinh học phân tử cơ bản.",
  },
];

const InstructorsSection = () => {
  // Sắp xếp thứ tự hiển thị: Viện trưởng -> Phó Viện trưởng -> Giảng viên
  const sortedInstructors = [...instructors].sort((a, b) => {
    const priority: Record<string, number> = {
      "Viện trưởng": 1,
      "Phó Viện trưởng": 2,
      "Giảng viên": 3,
    };
    return (priority[a.role] || 99) - (priority[b.role] || 99);
  });

  const leader = sortedInstructors.find((i) => i.role === "Viện trưởng");
  const others = sortedInstructors.filter((i) => i.role !== "Viện trưởng");

  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-[1280px] mx-auto px-10">
        <ScrollReveal
          variant={fadeInUp}
          className="flex flex-col items-center text-center mb-16"
        >
          <span className="color-primary font-bold tracking-widest text-sm uppercase mb-2">
            Chuyên gia
          </span>
          <h2 className="sm:text-4xl text-2xl font-extrabold text-gray-900">
            Đội ngũ Giảng viên hàng đầu
          </h2>
        </ScrollReveal>

        {/* Cấp cao nhất: Viện trưởng (Hiển thị nổi bật ở giữa) */}
        {leader && (
          <div className="flex justify-center mb-16">
            <ScrollReveal variant={fadeInUp} className="w-full max-w-2xl">
              <div className="bg-blue-50/30 p-10 rounded-[40px] border-2 border-blue-100/50 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
                <div className="relative w-48 h-48 mx-auto mb-8">
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full scale-110 group-hover:scale-125 transition-transform duration-500"></div>
                  <img
                    alt={leader.name}
                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl relative z-10"
                    src={leader.image}
                  />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-2">
                  {leader.name}
                </h3>
                <div className="inline-block bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 shadow-md uppercase tracking-wider">
                  {leader.role}
                </div>
                <p className="color-primary font-bold text-lg mb-4">
                  {leader.title}
                </p>
                <div className="max-w-xl mx-auto">
                  <p className="text-gray-600 leading-relaxed italic text-lg opacity-90">
                    "{leader.exp}"
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* Các cấp tiếp theo: Phó Viện trưởng & Giảng viên */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {others.map((instructor) => (
            <StaggerItem key={instructor.id}>
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col group">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gray-50 rounded-full scale-110 group-hover:bg-blue-50 transition-colors duration-300"></div>
                  <img
                    alt={instructor.name}
                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg relative z-10 grayscale-0 group-hover:grayscale-0 transition-all duration-500"
                    src={instructor.image}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:color-primary transition-colors">
                  {instructor.name}
                </h3>
                <p className="color-primary font-bold text-xs uppercase tracking-wider mb-3">
                  {instructor.role}
                </p>
                <div className="h-px w-12 bg-gray-100 mx-auto mb-4"></div>
                <p className="text-gray-900 font-semibold text-sm mb-4 min-h-[40px] flex items-center justify-center italic">
                  {instructor.title}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-4 mt-auto">
                  "{instructor.exp}"
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default InstructorsSection;
