const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Lexend',sans-serif]">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white">
        <div
          className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to from-[#0077BE] via-[#005a91] to-slate-900 hidden lg:block"
          style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)" }}
        />

        <div className="max-w-[1280px] mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10 py-20">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 bg-blue-50 text-[#0077BE] px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0077BE] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0077BE]"></span>
              </span>
              Chào mừng đến với IES Edu
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
              nghệ đột phá. Chúng tôi đồng hành cùng bạn trên con đường chinh
              phục đỉnh cao tri thức.
            </p>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-12 border-white/10">
              <div
                className="w-full aspect-4/5 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://plus.unsplash.com/premium_photo-1664299825291-909568eb8db7?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                }}
              />
              <div className="absolute top-10 right-10 size-32 bg-white/95 backdrop-blur-md rounded-full border-4 border-[#0077BE] flex flex-col items-center justify-center text-center shadow-2xl rotate-12">
                <span className="text-[#0077BE] text-3xl font-black leading-none">
                  10+
                </span>
                <span className="text-slate-600 text-[10px] font-bold uppercase tracking-tighter">
                  Năm kinh nghiệm
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="grid grid-cols-2 gap-6 relative">
              <div className="space-y-6">
                <div
                  className="rounded-3xl overflow-hidden shadow-2xl h-80 border-4 border-white bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop')",
                  }}
                />
                <div className="bg-[#0077BE] p-8 rounded-3xl text-white shadow-xl shadow-[#0077BE]/20">
                  <h4 className="text-3xl font-black mb-2">2011</h4>
                  <p className="text-sm font-medium opacity-90">
                    Tiền thân VNEDU chính thức đi vào hoạt động, đặt nền móng
                    cho IES.
                  </p>
                </div>
              </div>
              <div className="space-y-6 pt-12">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                  <span className="material-symbols-outlined text-[#0077BE] text-4xl mb-4">
                    history_edu
                  </span>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Hành trình 13 năm không ngừng đổi mới và phát triển bền
                    vững.
                  </p>
                </div>
                <div
                  className="rounded-3xl overflow-hidden shadow-2xl h-72 border-4 border-white bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&auto=format&fit=crop')",
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-10">
              <div className="space-y-4">
                <span className="text-[#0077BE] font-bold text-sm tracking-[0.3em] uppercase">
                  Câu chuyện của chúng tôi
                </span>
                <h2 className="text-4xl font-black text-slate-900 leading-tight">
                  Hành Trình Kiến Tạo <br />
                  <span className="text-[#0077BE]">Giá Trị Thực</span>
                </h2>
              </div>

              <div className="relative pl-12">
                <span className="absolute top-0 left-0 text-[#0077BE] text-7xl font-serif leading-none opacity-40">
                  "
                </span>
                <blockquote className="text-3xl lg:text-4xl font-serif italic text-slate-800 leading-tight">
                  Education gives you wings to fly
                </blockquote>
                <p className="mt-8 text-lg text-slate-600 leading-relaxed">
                  Tại IES, chúng tôi không chỉ giảng dạy lý thuyết. Chúng tôi
                  kiến tạo một môi trường mà ở đó, mỗi học viên được khuyến
                  khích tư duy phản biện, thực hành thực tế và nuôi dưỡng khát
                  vọng thay đổi thế giới.
                </p>
              </div>

              <div className="flex items-center gap-6 p-6 bg-white rounded-2xl border-l-4 border-[#0077BE] shadow-sm">
                <div className="size-14 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#0077BE]">
                    verified_user
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-700 italic">
                  Tiền thân là VNEDU (2011), IES tự hào là đơn vị tiên phong
                  trong hệ sinh thái khởi nghiệp tại Việt Nam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-32 px-6 bg-white relative">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1280px] opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "40px 100%",
          }}
        />
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-black text-slate-900">
              Tầm Nhìn & Sứ Mệnh
            </h2>
            <p className="text-slate-500 font-medium">
              Định hướng chiến lược đưa IES trở thành trung tâm tri thức hàng
              đầu khu vực.
            </p>
            <div className="w-24 h-1.5 bg-[#0077BE] mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Vision Card */}
            <div className="group relative bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,119,190,0.15)] transition-all duration-500 hover:-translate-y-3">
              <div className="size-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-[#0077BE] group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-blue-100/50">
                <span className="material-symbols-outlined text-[#0077BE] group-hover:text-white text-4xl">
                  visibility
                </span>
              </div>
              <h3 className="text-2xl font-extrabold mb-5 text-slate-900">
                Tầm nhìn
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Trở thành viện nghiên cứu và đào tạo hàng đầu, tiên phong trong
                việc ứng dụng các thành tựu khoa học công nghệ mới nhất vào
                giảng dạy và sản xuất kinh doanh toàn cầu.
              </p>
              <div className="mt-8 flex items-center gap-2 text-[#0077BE] font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Tìm hiểu thêm{" "}
                <span className="material-symbols-outlined text-sm">
                  arrow_right_alt
                </span>
              </div>
            </div>

            {/* Mission Card */}
            <div className="group relative bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,119,190,0.15)] transition-all duration-500 hover:-translate-y-3">
              <div className="size-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-[#0077BE] group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-blue-100/50">
                <span className="material-symbols-outlined text-[#0077BE] group-hover:text-white text-4xl">
                  public
                </span>
              </div>
              <h3 className="text-2xl font-extrabold mb-5 text-slate-900">
                Sứ mệnh
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Phục vụ cộng đồng thông qua giáo dục khai phóng, cung cấp nguồn
                nhân lực chất lượng cao và giải pháp khởi nghiệp sáng tạo đáp
                ứng tiêu chuẩn quốc tế khắt khe.
              </p>
              <div className="mt-8 flex items-center gap-2 text-[#0077BE] font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Tìm hiểu thêm{" "}
                <span className="material-symbols-outlined text-sm">
                  arrow_right_alt
                </span>
              </div>
            </div>

            {/* Core Values Card */}
            <div className="group relative bg-slate-600 p-10 rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:-translate-y-3 border-4 border-[#0077BE]/20">
              <div className="size-20 bg-[#0077BE] rounded-3xl flex items-center justify-center mb-8 rotate-12 group-hover:rotate-0 transition-all duration-500">
                <span className="material-symbols-outlined text-white text-4xl">
                  diamond
                </span>
              </div>
              <h3 className="text-2xl font-extrabold mb-5 text-white">
                Giá trị cốt lõi
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-300 font-medium">
                  <span className="size-2 bg-[#0077BE] rounded-full"></span>{" "}
                  Năng động - Sáng tạo
                </li>
                <li className="flex items-center gap-3 text-slate-300 font-medium">
                  <span className="size-2 bg-[#0077BE] rounded-full"></span> Bền
                  vững & Trách nhiệm
                </li>
                <li className="flex items-center gap-3 text-slate-300 font-medium">
                  <span className="size-2 bg-[#0077BE] rounded-full"></span>{" "}
                  Chất lượng vượt trội
                </li>
                <li className="flex items-center gap-3 text-slate-300 font-medium">
                  <span className="size-2 bg-[#0077BE] rounded-full"></span> Làm
                  chủ tương lai
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "40px 100%",
          }}
        />
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-xl space-y-4">
              <span className="text-[#0077BE] font-bold text-sm tracking-widest uppercase">
                Hoạt động chuyên môn
              </span>
              <h2 className="text-4xl font-black text-slate-900">
                Lĩnh vực trọng điểm
              </h2>
              <p className="text-slate-500 font-medium">
                IES cung cấp hệ sinh thái đào tạo toàn diện, tích hợp công nghệ
                và tư duy khởi nghiệp trong mọi lĩnh vực.
              </p>
            </div>
            4
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {/* Corporate Training */}
            <div className="bg-white p-8 rounded-4xl shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 group">
              <div className="size-20 rounded-3xl bg-blue-50 flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors duration-500">
                <span className="material-symbols-outlined text-4xl text-blue-600 group-hover:text-white">
                  corporate_fare
                </span>
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2">
                Đào tạo Doanh nghiệp
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nâng tầm năng lực quản trị và chuyển đổi số cho đội ngũ lãnh
                đạo.
              </p>
            </div>

            {/* Postgraduate */}
            <div className="bg-white p-8 rounded-4xl shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 group">
              <div className="size-20 rounded-3xl bg-orange-50 flex items-center justify-center mb-8 group-hover:bg-orange-500 transition-colors duration-500">
                <span className="material-symbols-outlined text-4xl text-orange-500 group-hover:text-white">
                  history_edu
                </span>
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2">
                Sau Đại học
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Các chương trình Thạc sĩ & Tiến sĩ chuyên sâu định hướng ứng
                dụng.
              </p>
            </div>

            {/* Children Skills */}
            <div className="bg-white p-8 rounded-4xl shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 group">
              <div className="size-20 rounded-3xl bg-green-50 flex items-center justify-center mb-8 group-hover:bg-green-600 transition-colors duration-500">
                <span className="material-symbols-outlined text-4xl text-green-600 group-hover:text-white">
                  child_care
                </span>
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2">
                Kỹ năng Trẻ em
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ươm mầm tài năng nhí với tư duy sáng tạo và kỹ năng thế kỷ 21.
              </p>
            </div>

            {/* Short Certificates */}
            <div className="bg-white p-8 rounded-4xl shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 group">
              <div className="size-20 rounded-3xl bg-purple-50 flex items-center justify-center mb-8 group-hover:bg-purple-600 transition-colors duration-500">
                <span className="material-symbols-outlined text-4xl text-purple-600 group-hover:text-white">
                  verified
                </span>
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2">
                Chứng chỉ Ngắn hạn
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Cập nhật kiến thức thực tế nhanh chóng với các khóa học tinh
                gọn.
              </p>
            </div>

            {/* Study Abroad */}
            <div className="bg-white p-8 rounded-4xl shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 group">
              <div className="size-20 rounded-3xl bg-cyan-50 flex items-center justify-center mb-8 group-hover:bg-cyan-500 transition-colors duration-500">
                <span className="material-symbols-outlined text-4xl text-cyan-600 group-hover:text-white">
                  flight_takeoff
                </span>
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2">
                Tư vấn Du học
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kết nối học thuật toàn cầu, hỗ trợ lộ trình vươn tầm thế giới.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Organization Structure */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-20 space-y-4">
            <span className="text-[#0077BE] font-bold text-sm tracking-widest uppercase">
              Quản trị viện
            </span>
            <h2 className="text-4xl font-black text-slate-900">
              Cơ Cấu Tổ Chức
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {/* Leadership */}
            <div className="group border-2 border-slate-100 rounded-3xl overflow-hidden hover:border-[#0077BE] transition-all duration-300">
              <div className="w-full bg-white px-10 py-8 flex items-center justify-between group-hover:bg-blue-50/50 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="size-14 rounded-2xl bg-[#0077BE]/10 flex items-center justify-center text-[#0077BE] group-hover:bg-[#0077BE] group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-3xl">
                      groups
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Ban lãnh đạo
                  </h3>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-[#0077BE]">
                  expand_more
                </span>
              </div>
              <div className="px-10 pb-10 pt-2 bg-white">
                <p className="text-slate-600 leading-relaxed">
                  Gồm Hội đồng Khoa học và Ban Giám đốc điều hành với sự góp mặt
                  của các Giáo sư, Tiến sĩ đầu ngành và những doanh nhân thành
                  đạt có tầm ảnh hưởng lớn trong cộng đồng khởi nghiệp Việt Nam.
                </p>
              </div>
            </div>

            {/* Departments */}
            <div className="group border-2 border-slate-100 rounded-3xl overflow-hidden hover:border-[#0077BE] transition-all duration-300">
              <div className="w-full bg-white px-10 py-8 flex items-center justify-between group-hover:bg-blue-50/50 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="size-14 rounded-2xl bg-[#0077BE]/10 flex items-center justify-center text-[#0077BE] group-hover:bg-[#0077BE] group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-3xl">
                      account_tree
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Phòng ban chức năng
                  </h3>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-[#0077BE]">
                  expand_more
                </span>
              </div>
              <div className="px-10 pb-10 pt-2 bg-white">
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    "Phòng Đào tạo & Khảo thí",
                    "Phòng Nghiên cứu & Phát triển (R&D)",
                    "Phòng Hợp tác Quốc tế",
                    "Phòng Hành chính - Nhân sự",
                  ].map((dept, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#0077BE] mt-1">
                        check_circle
                      </span>
                      <span className="font-bold text-slate-700">{dept}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subsidiaries */}
            <div className="group border-2 border-slate-100 rounded-3xl overflow-hidden hover:border-[#0077BE] transition-all duration-300">
              <div className="w-full bg-white px-10 py-8 flex items-center justify-between group-hover:bg-blue-50/50 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="size-14 rounded-2xl bg-[#0077BE]/10 flex items-center justify-center text-[#0077BE] group-hover:bg-[#0077BE] group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-3xl">
                      domain
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Đơn vị trực thuộc
                  </h3>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-[#0077BE]">
                  expand_more
                </span>
              </div>
              <div className="px-10 pb-10 pt-2 bg-white">
                <p className="text-slate-600 leading-relaxed">
                  Hệ thống các Trung tâm thực hành kỹ năng, Vườn ươm Khởi nghiệp
                  IES (IES Incubator) và các Chi nhánh đại diện chiến lược tại
                  các tỉnh thành trọng điểm trên toàn quốc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
