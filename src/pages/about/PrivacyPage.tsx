import { ScrollReveal, fadeInUp } from "@/components/ui/ScrollReveal";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Lexend',sans-serif] pb-20">
      {/* Header Section */}
      <section className="bg-white border-b border-slate-200 py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <ScrollReveal variant={fadeInUp}>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest border border-blue-100 mb-6">
              Quyền riêng tư & Bảo mật
            </div>
            <h1 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight mb-4">
              Chính Sách Bảo Mật
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              Cập nhật lần cuối: Tháng 3/2026 | IES EDU - iesfocus.edu.vn <br />
              <span className="text-xs text-blue-500 font-bold uppercase tracking-wider">
                Tuân thủ Luật BVDLCN số 91/2025/QH15
              </span>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 lg:py-20">
        <div className="max-w-[850px] mx-auto px-4 sm:px-6">
          <ScrollReveal
            variant={fadeInUp}
            className="bg-white rounded-3xl p-8 lg:p-12 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border border-slate-100 space-y-12"
          >
            {/* 1. Cam kết bảo mật */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">
                  1
                </span>
                Cam kết bảo mật
              </h2>
              <p className="text-slate-600 leading-relaxed">
                IES EDU cam kết bảo vệ quyền riêng tư của người dùng. Chính sách
                này mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ
                thông tin cá nhân của bạn khi sử dụng nền tảng iesfocus.edu.vn,
                tuân thủ Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15, Luật Dữ
                liệu số 60/2024/QH15 và Luật An toàn thông tin mạng số
                86/2015/QH13.
              </p>
            </div>

            {/* 2. Thông tin chúng tôi thu thập */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">
                  2
                </span>
                Thông tin chúng tôi thu thập
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800">
                    2.1. Thông tin bạn cung cấp trực tiếp
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Họ và tên, địa chỉ email, số điện thoại.",
                      "Nội dung đăng tải trên diễn đàn, bình luận.",
                      "Thông tin hồ sơ (ảnh, nghề nghiệp, mục tiêu).",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-slate-600 text-sm"
                      >
                        <span className="text-blue-500 mt-1">●</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800">
                    2.2. Thông tin thu thập tự động
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Địa chỉ IP, loại trình duyệt, thiết bị.",
                      "Dữ liệu hành vi, trang đã xem, tiến độ học.",
                      "Cookie và công nghệ theo dõi tương tự.",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-slate-600 text-sm"
                      >
                        <span className="text-blue-500 mt-1">●</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-8 bg-amber-50 border border-amber-100 p-6 rounded-2xl">
                <div className="flex items-center gap-2 text-amber-800 font-bold mb-2">
                  <span className="material-symbols-outlined text-amber-600">
                    warning
                  </span>
                  Dữ liệu cá nhân nhạy cảm
                </div>
                <p className="text-amber-700 text-sm leading-relaxed">
                  Theo Luật BVDLCN số 91/2025/QH15, dữ liệu hành vi sử dụng và
                  địa chỉ IP được phân loại là{" "}
                  <strong>DỮ LIỆU CÁ NHÂN NHẠY CẢM</strong>. IES EDU áp dụng các
                  biện pháp bảo vệ đặc biệt cho nhóm dữ liệu này: mã hóa riêng
                  biệt, hạn chế truy cập nghiêm ngặt và đánh giá tác động trước
                  khi xử lý.
                </p>
              </div>
            </div>

            {/* 3. Mục đích sử dụng thông tin */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">
                  3
                </span>
                Mục đích sử dụng thông tin
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: "rocket_launch",
                    text: "Cung cấp, vận hành và cải thiện dịch vụ học trực tuyến.",
                  },
                  {
                    icon: "person_celebrate",
                    text: "Quản lý tài khoản và tiến độ học tập của học viên.",
                  },
                  {
                    icon: "notifications_active",
                    text: "Gửi thông báo học tập, cập nhật khóa học quan trọng.",
                  },
                  {
                    icon: "mail",
                    text: "Gửi email về khóa học mới (có thể hủy đăng ký bất cứ lúc nào).",
                  },
                  {
                    icon: "analytics",
                    text: "Phân tích dữ liệu để cải thiện nội dung và trải nghiệm.",
                  },
                  {
                    icon: "shield_person",
                    text: "Ngăn chặn gian lận, bảo vệ an ninh hệ thống.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <span className="material-symbols-outlined text-blue-600 text-xl">
                      {item.icon}
                    </span>
                    <span className="text-slate-600 text-sm leading-snug">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Chia sẻ thông tin & trách nhiệm bên thứ ba */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">
                  4
                </span>
                Chia sẻ thông tin & trách nhiệm bên thứ ba
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4">
                <p className="font-bold text-slate-800">
                  IES EDU KHÔNG bán, cho thuê hoặc tiết lộ thông tin cá nhân của
                  bạn cho bên thứ ba, ngoại trừ:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Đối tác cung cấp dịch vụ hỗ trợ hoạt động nền tảng (lưu trữ,
                    email) - tất cả phải ký THỎA THUẬN BẢO MẬT và chỉ xử lý dữ
                    liệu theo đúng mục đích cam kết.
                  </li>
                  <li>
                    Cơ quan nhà nước có thẩm quyền khi có yêu cầu hợp pháp theo
                    quy định pháp luật.
                  </li>
                  <li>
                    Giảng viên phụ trách khóa học được tiếp cận thông tin học
                    viên TRONG PHẠM VI GIẢNG DẠY ĐƯỢC ỦY QUYỀN. Giảng viên chịu
                    TRÁCH NHIỆM PHÁP LÝ nếu để lộ lọt thông tin.
                  </li>
                </ul>
              </div>
            </div>

            {/* 5. Bảo vệ thông tin & xử lý sự cố */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">
                  5
                </span>
                Bảo vệ thông tin & xử lý sự cố
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    title: "Mã hóa SSL/TLS",
                    desc: "Mã hóa toàn bộ dữ liệu truyền qua mạng.",
                  },
                  {
                    title: "Kiểm soát truy cập",
                    desc: "Chỉ nhân viên có thẩm quyền mới được truy cập.",
                  },
                  {
                    title: "Sao lưu định kỳ",
                    desc: "Đảm bảo khả năng phục hồi khi có sự cố.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-5 bg-blue-50 rounded-2xl border border-blue-100 text-center"
                  >
                    <div className="font-bold text-blue-900 text-sm mb-1">
                      {item.title}
                    </div>
                    <div className="text-blue-700 text-xs">{item.desc}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="flex gap-4 p-6 bg-red-50 rounded-2xl border border-red-100">
                  <span className="material-symbols-outlined text-red-600 text-3xl">
                    notifications_active
                  </span>
                  <div>
                    <div className="font-bold text-red-900 mb-1">
                      Cam kết thông báo sự cố trong 72 giờ
                    </div>
                    <p className="text-red-700 text-sm">
                      Trường hợp xảy ra lộ lọt hoặc mất dữ liệu, IES EDU cam kết
                      thông báo đến người dùng bị ảnh hưởng và cơ quan có thẩm
                      quyền TRONG VÒNG 72 GIỜ.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <span className="material-symbols-outlined text-blue-600 text-3xl">
                    fact_check
                  </span>
                  <div>
                    <div className="font-bold text-blue-900 mb-1">
                      Đánh giá tuân thủ định kỳ
                    </div>
                    <p className="text-blue-700 text-sm">
                      IES EDU thực hiện kiểm tra, đánh giá hệ thống bảo mật IT
                      NHẤT 01 LẦN/NĂM để đảm bảo liên tục tuân thủ các quy định
                      pháp luật.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. Quyền của người dùng */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">
                  6
                </span>
                Quyền của người dùng
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: "visibility",
                    title: "Quyền truy cập",
                    desc: "Xem thông tin cá nhân đang được lưu trữ.",
                  },
                  {
                    icon: "edit",
                    title: "Quyền chỉnh sửa",
                    desc: "Cập nhật hoặc sửa thông tin không chính xác.",
                  },
                  {
                    icon: "delete",
                    title: "Quyền xóa",
                    desc: "Yêu cầu xóa tài khoản và dữ liệu cá nhân.",
                  },
                  {
                    icon: "undo",
                    title: "Rút lại sự đồng ý",
                    desc: "Có thể rút lại sự đồng ý xử lý dữ liệu bất cứ lúc nào.",
                  },
                  {
                    icon: "move_up",
                    title: "Di chuyển dữ liệu",
                    desc: "Yêu cầu cung cấp dữ liệu dưới định dạng CSV/JSON.",
                  },
                  {
                    icon: "block",
                    title: "Quyền phản đối",
                    desc: "Từ chối nhận email marketing.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors"
                  >
                    <span className="material-symbols-outlined text-blue-600 mb-2">
                      {item.icon}
                    </span>
                    <span className="font-bold text-slate-800 text-sm mb-1">
                      {item.title}
                    </span>
                    <span className="text-slate-500 text-xs leading-relaxed">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-6 p-4 bg-slate-900 text-white/80 rounded-xl text-center text-sm">
                Để thực hiện bất kỳ quyền nào ở trên, vui lòng liên hệ{" "}
                <span className="text-white font-bold">
                  infovienies@gmail.com
                </span>
                . Chúng tôi sẽ phản hồi trong vòng 5 ngày làm việc.
              </p>
            </div>

            {/* 8-9. Lưu trữ & Liên hệ */}
            <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between gap-8">
              <div className="max-w-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Thời gian lưu trữ
                </span>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Thông tin sẽ được lưu trữ trong suốt thời gian tài khoản hoạt
                  động và trong vòng 2 năm sau khi xóa tài khoản.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Liên hệ bảo mật
                </span>
                <a
                  href="mailto:infovienies@gmail.com"
                  className="text-blue-600 font-bold hover:underline mb-1"
                >
                  infovienies@gmail.com
                </a>
                <span className="text-slate-900 font-bold">0965 248 115</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
