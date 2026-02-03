import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
} from "../../components/ui/ScrollReveal";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Lexend',sans-serif] overflow-x-hidden">
      {/* --- HERO SECTION --- */}
      {/* Mobile: min-h-screen hoặc auto để tránh bàn phím ảo che mất content */}
      <section className="relative min-h-auto lg:min-h-[85vh] flex items-center overflow-hidden bg-white">
        {/* Background Decorative - Giữ nguyên logic hidden mobile */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to from-[#0077BE] via-[#005a91] to-slate-900 hidden lg:block"
          style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)" }}
        />

        {/* Container: px-4 cho mobile, px-6 cho tablet/desktop */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10 py-12 lg:py-20">
          <ScrollReveal variant={fadeInLeft} className="space-y-6 lg:space-y-8">
            <div className="inline-flex items-center gap-3 bg-blue-50 color-primary px-3 py-1.5 lg:px-4 lg:py-2 rounded-full font-bold text-[10px] lg:text-xs uppercase tracking-widest border border-blue-100 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full color-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 color-primary"></span>
              </span>
              Chào mừng đến với IES EDU
            </div>

            <h1 className="text-slate-900 text-start text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.2] lg:leading-[1.1] tracking-tight">
              Viện Khoa Học Sáng Tạo Khởi Nghiệp
            </h1>

            <p className="text-base lg:text-xl text-start text-slate-600 leading-relaxed max-w-xl">
              Kiến tạo tương lai thông qua giáo dục khai phóng và ứng dụng công
              nghệ đột phá. Chúng tôi đồng hành cùng bạn trên con đường chinh
              phục đỉnh cao tri thức.
            </p>
          </ScrollReveal>

          <ScrollReveal
            variant={fadeInRight}
            className="relative hidden lg:block -mt-10"
          >
            <div className="relative rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-12 border-white/10">
              <div
                className="w-full aspect-4/5 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://plus.unsplash.com/premium_photo-1664299825291-909568eb8db7?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                }}
              />
              <div className="absolute top-10 right-10 size-32 bg-white/95 backdrop-blur-md rounded-full border-4 border-[#0077BE] flex flex-col items-center justify-center text-center shadow-2xl rotate-12">
                <span className="color-primary text-3xl font-black leading-none">
                  10+
                </span>
                <span className="text-slate-600 text-sm font-bold uppercase tracking-tighter">
                  Năm kinh nghiệm
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* --- STORY SECTION --- */}
      {/* Mobile: py-16, Desktop: py-32 */}
      <section className="py-16 lg:py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Cột ảnh: Mobile -> 1 cột (hoặc 2 cột nhỏ tuỳ ý, ở đây tôi gom lại cho dễ nhìn) hoặc giữ nguyên nhưng giảm gap */}
            {/* Sửa: grid-cols-1 trên mobile nhỏ, sm:grid-cols-2 trên tablet */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative order-2 lg:order-1">
              <ScrollReveal variant={fadeInLeft} className="space-y-6">
                <div
                  className="rounded-3xl overflow-hidden shadow-2xl h-64 lg:h-80 border-4 border-white bg-cover bg-center"
                  style={{
                    backgroundImage: "url('/img/bg-about-story-1.png')",
                  }}
                />
                <div className="color-primary p-6 lg:p-8 rounded-3xl text-white shadow-xl shadow-[#0077BE]/20">
                  <h4 className="text-2xl lg:text-3xl font-black mb-2">2011</h4>
                  <p className="text-sm font-medium opacity-90">
                    Tiền thân VNEDU chính thức đi vào hoạt động, đặt nền móng
                    cho IES.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal
                variant={fadeInLeft}
                delay={0.2}
                className="space-y-6 lg:pt-12"
              >
                <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-xl border border-slate-100">
                  <span className="material-symbols-outlined color-primary text-4xl mb-4">
                    history_edu
                  </span>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Hành trình 13 năm không ngừng đổi mới và phát triển bền
                    vững.
                  </p>
                </div>
                <div
                  className="rounded-3xl overflow-hidden shadow-2xl h-64 lg:h-72 border-4 border-white bg-cover bg-center"
                  style={{
                    backgroundImage: "url('/img/bg-about-story-2.png')",
                  }}
                />
              </ScrollReveal>
            </div>

            <ScrollReveal
              variant={fadeInRight}
              className="flex flex-col gap-8 lg:gap-10 order-1 lg:order-2"
            >
              <div className="space-y-4">
                <span className="color-primary font-bold text-xs lg:text-sm tracking-[0.3em] uppercase">
                  Câu chuyện của chúng tôi
                </span>
                <h2 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                  Hành Trình Kiến Tạo <br />
                  <span className="color-primary">Giá Trị Thực</span>
                </h2>
              </div>

              {/* Bỏ padding-left lớn trên mobile */}
              <div className="relative pl-0 lg:pl-12">
                <span className="hidden lg:block absolute top-0 left-0 color-primary text-7xl font-serif leading-none opacity-40">
                  "
                </span>
                <blockquote className="text-2xl lg:text-4xl font-serif italic text-slate-800 leading-tight">
                  Education gives you wings to fly
                </blockquote>
                <p className="mt-6 lg:mt-8 text-base lg:text-lg text-slate-600 leading-relaxed">
                  Tại IES, chúng tôi không chỉ giảng dạy lý thuyết. Chúng tôi
                  kiến tạo một môi trường mà ở đó, mỗi học viên được khuyến
                  khích tư duy phản biện, thực hành thực tế và nuôi dưỡng khát
                  vọng thay đổi thế giới.
                </p>
              </div>

              <div className="flex items-center gap-4 lg:gap-6 p-4 lg:p-6 bg-white rounded-2xl border-l-4 border-[#0077BE] shadow-sm">
                <div className="size-10 lg:size-14 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined color-primary text-xl lg:text-2xl">
                    verified_user
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-700 italic">
                  Tiền thân là VNEDU (2011), IES tự hào là đơn vị tiên phong
                  trong hệ sinh thái khởi nghiệp tại Việt Nam.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* --- VISION & MISSION --- */}
      <section className="py-16 lg:py-32 px-4 sm:px-6 bg-white relative">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1280px] opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "40px 100%",
          }}
        />
        <div className="max-w-[1280px] mx-auto relative z-10">
          <ScrollReveal
            variant={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-12 lg:mb-20 space-y-4"
          >
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900">
              Tầm Nhìn & Sứ Mệnh
            </h2>
            <p className="text-slate-500 font-medium text-sm lg:text-base">
              Định hướng chiến lược đưa IES trở thành trung tâm tri thức hàng
              đầu khu vực.
            </p>
            <div className="w-16 lg:w-24 h-1.5 color-primary mx-auto rounded-full"></div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
            {/* Vision Card - Giảm padding mobile p-6 */}
            <StaggerItem>
              <div className="group relative bg-white border border-slate-100 p-6 lg:p-10 rounded-4xl lg:rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,119,190,0.15)] transition-all duration-500 hover:-translate-y-3">
                <div className="size-16 lg:size-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 lg:mb-8 group-hover:color-primary group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-blue-100/50">
                  <span className="material-symbols-outlined color-primary group-hover:text-white text-3xl lg:text-4xl">
                    visibility
                  </span>
                </div>
                <h3 className="text-xl lg:text-2xl font-extrabold mb-3 lg:mb-5 text-slate-900">
                  Tầm nhìn
                </h3>
                <p className="text-slate-600 text-sm lg:text-base leading-relaxed">
                  Trở thành viện nghiên cứu và đào tạo hàng đầu, tiên phong
                  trong việc ứng dụng các thành tựu khoa học công nghệ mới nhất.
                </p>
                <div className="mt-6 lg:mt-8 flex items-center gap-2 color-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Tìm hiểu thêm{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_right_alt
                  </span>
                </div>
              </div>
            </StaggerItem>

            {/* Mission Card */}
            <StaggerItem>
              <div className="group relative bg-white border border-slate-100 p-6 lg:p-10 rounded-4xl lg:rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,119,190,0.15)] transition-all duration-500 hover:-translate-y-3">
                <div className="size-16 lg:size-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 lg:mb-8 group-hover:color-primary group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-blue-100/50">
                  <span className="material-symbols-outlined color-primary group-hover:text-white text-3xl lg:text-4xl">
                    public
                  </span>
                </div>
                <h3 className="text-xl lg:text-2xl font-extrabold mb-3 lg:mb-5 text-slate-900">
                  Sứ mệnh
                </h3>
                <p className="text-slate-600 text-sm lg:text-base leading-relaxed">
                  Phục vụ cộng đồng thông qua giáo dục khai phóng, cung cấp
                  nguồn nhân lực chất lượng cao và giải pháp khởi nghiệp sáng
                  tạo.
                </p>
                <div className="mt-6 lg:mt-8 flex items-center gap-2 color-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Tìm hiểu thêm{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_right_alt
                  </span>
                </div>
              </div>
            </StaggerItem>

            {/* Core Values Card */}
            <StaggerItem>
              <div className="group relative bg-slate-600 p-6 lg:p-10 rounded-4xl lg:rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:-translate-y-3 border-4 border-[#0077BE]/20">
                <div className="size-16 lg:size-20 color-primary border border-white rounded-3xl flex items-center justify-center mb-6 lg:mb-8 rotate-12 group-hover:rotate-0 transition-all duration-500">
                  <span className="material-symbols-outlined text-white text-3xl lg:text-4xl">
                    diamond
                  </span>
                </div>
                <h3 className="text-xl lg:text-2xl font-extrabold mb-3 lg:mb-5 text-white">
                  Giá trị cốt lõi
                </h3>
                <ul className="space-y-3 lg:space-y-4">
                  {[
                    "Năng động - Sáng tạo",
                    "Bền vững & Trách nhiệm",
                    "Chất lượng vượt trội",
                    "Làm chủ tương lai",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-slate-300 font-medium text-sm lg:text-base"
                    >
                      <span className="size-2 color-primary rounded-full shrink-0"></span>{" "}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* --- FOCUS AREAS --- */}
      <section className="py-16 lg:py-32 bg-slate-50 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "40px 100%",
          }}
        />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
          <ScrollReveal
            variant={fadeInUp}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-20 gap-6 lg:gap-8"
          >
            <div className="max-w-xl space-y-3 lg:space-y-4">
              <span className="color-primary font-bold text-xs lg:text-sm tracking-widest uppercase">
                Hoạt động chuyên môn
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900">
                Lĩnh vực trọng điểm
              </h2>
              <p className="text-slate-500 font-medium text-sm lg:text-base">
                IES cung cấp hệ sinh thái đào tạo toàn diện, tích hợp công nghệ
                và tư duy khởi nghiệp trong mọi lĩnh vực.
              </p>
            </div>
            {/* Nếu số 4 ở code cũ là trang trí thì để, không thì xoá. Tôi tạm ẩn đi */}
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Mapping data để code gọn hơn */}
            {[
              {
                title: "Đào tạo Doanh nghiệp",
                desc: "Nâng tầm năng lực quản trị và chuyển đổi số.",
                icon: "corporate_fare",
                color: "blue",
              },
              {
                title: "Đào tạo Sau Đại học",
                desc: "Thạc sĩ & Tiến sĩ chuyên sâu định hướng ứng dụng.",
                icon: "history_edu",
                color: "red",
              },
              {
                title: "Phát triển kỹ năng trẻ em",
                desc: "Ươm mầm tài năng nhí với tư duy sáng tạo.",
                icon: "child_care",
                color: "green",
              },
              {
                title: "Chứng chỉ nghiệp vụ ngắn hạn",
                desc: "Cập nhật kiến thức thực tế nhanh chóng.",
                icon: "verified",
                color: "purple",
              },
              {
                title: "Tư vấn Du học",
                desc: "Kết nối học thuật toàn cầu, hỗ trợ lộ trình.",
                icon: "flight_takeoff",
                color: "cyan",
              },
            ].map((item, idx) => (
              <StaggerItem
                key={idx}
                className="bg-white p-6 lg:p-8 rounded-4xl lg:rounded-4xl shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 group"
              >
                {/* Dynamic color classes handling */}
                <div
                  className={`size-16 lg:size-20 rounded-3xl bg-${item.color}-50 flex items-center justify-center mb-6 lg:mb-8 group-hover:bg-${item.color}-600 transition-colors duration-500`}
                >
                  <span
                    className={`material-symbols-outlined text-3xl lg:text-4xl text-${item.color}-600`}
                  >
                    {item.icon}
                  </span>
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* --- ORGANIZATION STRUCTURE --- */}
      <section className="py-16 lg:py-32 px-4 sm:px-6 bg-white">
        <div className="max-w-[900px] mx-auto">
          <ScrollReveal
            variant={fadeInUp}
            className="text-center mb-12 lg:mb-20 space-y-4"
          >
            <span className="color-primary font-bold text-xs lg:text-sm tracking-widest uppercase">
              Quản trị viện
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900">
              Cơ Cấu Tổ Chức
            </h2>
          </ScrollReveal>

          <StaggerContainer className="flex flex-col gap-4 lg:gap-6">
            {/* Leadership - Mobile padding px-5 */}
            <StaggerItem className="group border-2 border-slate-100 rounded-2xl lg:rounded-3xl overflow-hidden hover:border-[#0077BE] transition-all duration-300">
              <div className="w-full bg-white px-5 py-6 lg:px-10 lg:py-8 flex items-center justify-between group-hover:bg-blue-50/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="size-12 lg:size-14 rounded-2xl color-primary/10 flex items-center justify-center color-primary group-hover:color-primary group-hover:text-white transition-all shrink-0">
                    <span className="material-symbols-outlined text-2xl lg:text-3xl">
                      groups
                    </span>
                  </div>
                  <h3 className="text-lg lg:text-xl font-extrabold text-slate-900">
                    Ban lãnh đạo
                  </h3>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:color-primary">
                  expand_more
                </span>
              </div>
              <div className="px-5 lg:px-10 pb-8 lg:pb-10 pt-2 bg-white">
                <ul className="space-y-4">
                  <li className="text-sm lg:text-base text-slate-600 leading-relaxed">
                    <strong className="text-slate-900 block mb-1">
                      Viện trưởng
                    </strong>
                    Chịu trách nhiệm quản lý và định hướng chiến lược chung của
                    Viện.
                  </li>
                  <li className="text-sm lg:text-base text-slate-600 leading-relaxed">
                    <strong className="text-slate-900 block mb-1">
                      Phó viện trưởng (hai vị trí)
                    </strong>
                    Hỗ trợ Viện trưởng trong các lĩnh vực chuyên môn và điều
                    hành.
                  </li>
                </ul>
              </div>
            </StaggerItem>

            {/* Departments */}
            <StaggerItem className="group border-2 border-slate-100 rounded-2xl lg:rounded-3xl overflow-hidden hover:border-[#0077BE] transition-all duration-300">
              <div className="w-full bg-white px-5 py-6 lg:px-10 lg:py-8 flex items-center justify-between group-hover:bg-blue-50/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="size-12 lg:size-14 rounded-2xl color-primary/10 flex items-center justify-center color-primary group-hover:color-primary group-hover:text-white transition-all shrink-0">
                    <span className="material-symbols-outlined text-2xl lg:text-3xl">
                      account_tree
                    </span>
                  </div>
                  <h3 className="text-lg lg:text-xl font-extrabold text-slate-900">
                    Bộ phận chức năng
                  </h3>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:color-primary">
                  expand_more
                </span>
              </div>
              <div className="px-5 lg:px-10 pb-8 lg:pb-10 pt-2 bg-white">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {[
                    {
                      name: "Văn phòng hành chính",
                      desc: "Đảm nhiệm các công việc hành chính, hỗ trợ hoạt động chung của Viện.",
                    },
                    {
                      name: "Phòng tổ chức - cán bộ",
                      desc: "Quản lý nhân sự và các hoạt động liên quan đến tổ chức.",
                    },
                    {
                      name: "Phòng đào tạo",
                      desc: "Phụ trách xây dựng và triển khai các chương trình đào tạo.",
                    },
                    {
                      name: "Phòng nghiên cứu khoa học và hợp tác quốc tế",
                      desc: "Thúc đẩy các hoạt động nghiên cứu và thiết lập quan hệ hợp tác.",
                    },
                    {
                      name: "Phòng tài chính - kế toán",
                      desc: "Quản lý các vấn đề tài chính và kế toán của Viện.",
                    },
                  ].map((dept, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="material-symbols-outlined color-primary mt-1 text-xl shrink-0">
                        check_circle
                      </span>
                      <div>
                        <span className="font-bold text-slate-700 text-sm lg:text-base block">
                          {dept.name}
                        </span>
                        <span className="text-slate-600 text-sm leading-snug">
                          {dept.desc}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>

            {/* Subsidiaries */}
            <StaggerItem className="group border-2 border-slate-100 rounded-2xl lg:rounded-3xl overflow-hidden hover:border-[#0077BE] transition-all duration-300">
              <div className="w-full bg-white px-5 py-6 lg:px-10 lg:py-8 flex items-center justify-between group-hover:bg-blue-50/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="size-12 lg:size-14 rounded-2xl color-primary/10 flex items-center justify-center color-primary group-hover:color-primary group-hover:text-white transition-all shrink-0">
                    <span className="material-symbols-outlined text-2xl lg:text-3xl">
                      domain
                    </span>
                  </div>
                  <h3 className="text-lg lg:text-xl font-extrabold text-slate-900">
                    Đơn vị trực thuộc
                  </h3>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:color-primary">
                  expand_more
                </span>
              </div>
              <div className="px-5 lg:px-10 pb-8 lg:pb-10 pt-2 bg-white">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {[
                    {
                      name: "Tạp chí khoa học",
                      desc: "Phụ trách xuất bản các ấn phẩm nghiên cứu và khoa học.",
                    },
                    {
                      name: "Trung tâm dịch thuật",
                      desc: "Cung cấp các dịch vụ dịch thuật chuyên nghiệp.",
                    },
                    {
                      name: "Trung tâm đào tạo và bồi dưỡng nghiệp vụ kinh tế",
                      desc: "Tổ chức các khóa học ngắn hạn và bồi dưỡng chuyên môn.",
                    },
                    {
                      name: "Trung tâm nghiên cứu ứng dụng kinh tế tri thức",
                      desc: "Tập trung vào nghiên cứu ứng dụng thực tiễn trong lĩnh vực kinh tế tri thức.",
                    },
                    {
                      name: "Trung tâm tư vấn kinh tế",
                      desc: "Cung cấp các dịch vụ tư vấn cho doanh nghiệp và cá nhân.",
                    },
                  ].map((unit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="material-symbols-outlined color-primary mt-1 text-xl shrink-0">
                        domain
                      </span>
                      <div>
                        <span className="font-bold text-slate-700 text-sm lg:text-base block">
                          {unit.name}
                        </span>
                        <span className="text-slate-600 text-sm leading-snug">
                          {unit.desc}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>

            <ScrollReveal
              variant={fadeInUp}
              className="bg-blue-50/50 rounded-2xl p-6 lg:p-8 border border-blue-100 mt-4"
            >
              <p className="text-slate-600 text-sm lg:text-base leading-relaxed text-center italic">
                Cơ cấu tổ chức của Viện được thiết kế nhằm đảm bảo tính chuyên
                nghiệp và hiệu quả trong mọi hoạt động. Sự phân chia rõ ràng
                giữa các bộ phận lãnh đạo, chức năng và đơn vị trực thuộc giúp
                IES vận hành trơn tru, đồng thời tạo điều kiện thuận lợi cho
                việc thực hiện sứ mệnh và tầm nhìn đã đề ra.
              </p>
            </ScrollReveal>
          </StaggerContainer>
        </div>
      </section>

      {/* --- CONCLUSION SECTION --- */}
      <section className="py-16 lg:py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#0077BE]/10 blur-3xl rounded-full translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-purple-500/10 blur-3xl rounded-full -translate-x-1/2"></div>

        <ScrollReveal
          variant={fadeInUp}
          className="max-w-[1000px] mx-auto px-4 sm:px-6 relative z-10 text-center"
        >
          <span className="color-primary font-bold text-xs lg:text-sm tracking-[0.3em] uppercase mb-6 block">
            Kết luận
          </span>
          <h2 className="text-2xl lg:text-4xl font-black leading-tight mb-8">
            Tiên phong trong đào tạo & <br />
            <span className="color-primary">Nghiên cứu ứng dụng</span>
          </h2>
          <p className="text-slate-300 text-base lg:text-lg leading-relaxed max-w-3xl mx-auto">
            Tóm lại, Viện Khoa Học Công Nghệ Sáng Tạo Khởi Nghiệp là một tổ chức
            tiên phong trong lĩnh vực đào tạo và nghiên cứu, với mục tiêu cung
            cấp các chương trình giáo dục chất lượng cao, ứng dụng thực tiễn và
            có tầm nhìn toàn cầu. Với lịch sử phát triển hơn một thập kỷ, IES đã
            khẳng định được vị thế của mình thông qua các giá trị cốt lõi, sứ
            mệnh phục vụ cộng đồng và tầm nhìn trở thành đơn vị dẫn đầu trong
            ứng dụng khoa học công nghệ vào đào tạo. Các lĩnh vực hoạt động đa
            dạng cùng cơ cấu tổ chức chặt chẽ là nền tảng giúp Viện tiếp tục
            phát triển bền vững và đóng góp tích cực vào sự nghiệp phát triển
            kinh tế - xã hội của đất nước.
          </p>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default AboutPage;
