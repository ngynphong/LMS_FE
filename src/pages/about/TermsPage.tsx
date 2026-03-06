import { ScrollReveal, fadeInUp } from "@/components/ui/ScrollReveal";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Lexend',sans-serif] pb-20">
      {/* Header Section */}
      <section className="bg-white border-b border-slate-200 py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <ScrollReveal variant={fadeInUp}>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0077BE] px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest border border-blue-100 mb-6">
              Điều khoản & Quy định
            </div>
            <h1 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight mb-4">
              Điều Khoản Dịch Vụ
            </h1>
            <p className="text-slate-500 font-medium">
              Cập nhật lần cuối: Tháng 3/2026 | IES EDU - iesfocus.edu.vn
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 lg:py-20">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          <ScrollReveal
            variant={fadeInUp}
            className="bg-white rounded-3xl p-8 lg:p-12 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border border-slate-100 space-y-10"
          >
            {/* 1. Giới thiệu */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">
                  1
                </span>
                Giới thiệu
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4">
                <p>
                  Chào mừng bạn đến với IES EDU (Institute of Science Technology
                  Education) - nền tảng học tập trực tuyến tại địa chỉ
                  iesfocus.edu.vn.
                </p>
                <p>
                  Bằng việc truy cập và sử dụng trang web, bạn xác nhận đã đọc,
                  hiểu và đồng ý tuân thủ các điều khoản dịch vụ sau đây. Nếu
                  bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngừng sử
                  dụng dịch vụ của chúng tôi.
                </p>
              </div>
            </div>

            {/* 2. Điều kiện sử dụng */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">
                  2
                </span>
                Điều kiện sử dụng
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    2.1. Đối tượng sử dụng
                  </h3>
                  <ul className="list-disc pl-5 text-slate-600 space-y-2">
                    <li>
                      Người dùng từ 13 tuổi trở lên. Người dùng dưới 18 tuổi cần
                      có sự đồng ý của phụ huynh hoặc người giám hộ.
                    </li>
                    <li>
                      Học viên cá nhân có nhu cầu học các khóa học công nghệ,
                      khoa học và khởi nghiệp.
                    </li>
                    <li>
                      Giảng viên, chuyên gia mong muốn chia sẻ kiến thức qua nền
                      tảng.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    2.2. Tài khoản người dùng
                  </h3>
                  <p className="text-slate-600 mb-3">
                    Khi đăng ký tài khoản tại IES EDU, bạn cam kết:
                  </p>
                  <ul className="list-disc pl-5 text-slate-600 space-y-2">
                    <li>Cung cấp thông tin chính xác, đầy đủ và cập nhật.</li>
                    <li>
                      Bảo mật mật khẩu và thông tin đăng nhập của tài khoản.
                    </li>
                    <li>
                      Chịu hoàn toàn trách nhiệm về mọi hoạt động diễn ra dưới
                      tài khoản của bạn.
                    </li>
                    <li>
                      Thông báo ngay cho IES EDU khi phát hiện có truy cập trái
                      phép vào tài khoản.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Quyền và nghĩa vụ */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">
                  3
                </span>
                Quyền và nghĩa vụ
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-blue-600 font-bold mb-3 uppercase text-sm tracking-wider">
                    Quyền của người dùng
                  </h3>
                  <ul className="text-slate-600 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">●</span> Truy cập và
                      học tập miễn phí các khóa học được cung cấp trên nền tảng.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">●</span> Nhận hỗ trợ
                      kỹ thuật và tư vấn học tập từ đội ngũ IES EDU.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">●</span> Nhận chứng
                      chỉ hoàn thành khóa học theo quy định của từng chương
                      trình.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">●</span> Tham gia
                      diễn đàn học viên và kết nối cộng đồng.
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-red-600 font-bold mb-3 uppercase text-sm tracking-wider">
                    Nghĩa vụ của người dùng
                  </h3>
                  <ul className="text-slate-600 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">●</span> Không sao
                      chép, phát tán, chia sẻ tài liệu, video bài giảng của IES
                      EDU dưới mọi hình thức.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">●</span> Không sử dụng
                      dịch vụ cho mục đích bất hợp pháp hoặc gây hại đến người
                      khác.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">●</span> Không can
                      thiệp vào hệ thống kỹ thuật hoặc xâm phạm an toàn thông
                      tin của nền tảng.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">●</span> Tôn trọng
                      quyền sở hữu trí tuệ của IES EDU và các giảng viên cộng
                      tác.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 4. Chính sách khóa học miễn phí */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">
                  4
                </span>
                Chính sách khóa học miễn phí
              </h2>
              <ul className="list-disc pl-5 text-slate-600 space-y-3">
                <li>
                  Toàn bộ nội dung khóa học trên IES EDU được cung cấp hoàn toàn
                  miễn phí cho người dùng đã đăng ký tài khoản.
                </li>
                <li>
                  IES EDU có quyền bổ sung, điều chỉnh hoặc tạm ngừng một số
                  khóa học mà không cần thông báo trước.
                </li>
                <li>
                  Một số tính năng nâng cao có thể yêu cầu điều kiện tham gia
                  riêng và sẽ được thông báo rõ ràng.
                </li>
              </ul>
            </div>

            {/* 5. Chấm dứt dịch vụ */}
            <div className="bg-red-50 p-6 lg:p-8 rounded-3xl border border-red-100">
              <h2 className="text-2xl font-black text-red-900 mb-4 flex items-center gap-3">
                <span className="size-8 rounded-lg bg-red-600 text-white flex items-center justify-center text-sm">
                  5
                </span>
                Chấm dứt dịch vụ
              </h2>
              <p className="text-red-800 mb-4">
                IES EDU có quyền tạm ngừng hoặc chấm dứt tài khoản người dùng
                trong các trường hợp:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Vi phạm điều khoản dịch vụ.",
                  "Có hành vi gian lận hoặc gây hại.",
                  "Theo yêu cầu của cơ quan pháp luật.",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-red-700 text-sm font-medium"
                  >
                    <span className="material-symbols-outlined text-red-500 text-lg">
                      error_outline
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 6. Sửa đổi điều khoản */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">
                  6
                </span>
                Sửa đổi điều khoản
              </h2>
              <div className="text-slate-600 space-y-4">
                <p>
                  IES EDU có quyền cập nhật, sửa đổi các điều khoản dịch vụ bất
                  kỳ lúc nào.
                </p>
                <p>
                  Người dùng sẽ được thông báo về những thay đổi quan trọng qua
                  email hoặc thông báo trên nền tảng. Việc tiếp tục sử dụng sau
                  khi thay đổi có hiệu lực đồng nghĩa với việc bạn chấp nhận các
                  điều khoản mới.
                </p>
              </div>
            </div>

            {/* 7. Liên hệ */}
            <div className="pt-10 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Email
                </span>
                <a
                  href="mailto:infovienies@gmail.com"
                  className="text-blue-600 font-bold hover:underline"
                >
                  infovienies@gmail.com
                </a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Điện thoại
                </span>
                <span className="text-slate-900 font-bold">0965 248 115</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Địa chỉ
                </span>
                <span className="text-slate-600 text-sm font-medium">
                  Số 3 Công Trường Quốc Tế, P. Xuân Hòa, TP. HCM
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
