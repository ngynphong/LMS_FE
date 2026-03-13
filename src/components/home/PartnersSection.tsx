import { motion } from "motion/react";
import { ScrollReveal, fadeInUp } from "../ui/ScrollReveal";

interface Partner {
  id: number;
  name: string;
  description: string;
  logo: string;
}

const partners: Partner[] = [
  {
    id: 1,
    name: "IIG Việt Nam",
    description:
      "IIG là tổ chức hàng đầu cung cấp các bài thi đánh giá năng lực quốc tế và giải pháp giáo dục, độc quyền tổ chức các kỳ thi TOEIC, MOS, IC3, IC3 Spark tại Việt Nam.",
    logo: "/img/partners/iig-vietnam.png",
  },
  {
    id: 2,
    name: "VN247",
    description:
      "Trung tâm khảo thí Ủy quyền Cambridge English – VN247 tự hào là đơn vị uy tín hàng đầu, đạt chuẩn khảo thí Quốc tế.",
    logo: "/img/partners/vn247.png",
  },
  {
    id: 3,
    name: "UBTECH",
    description:
      "UBTECH là một trong những công ty đa quốc gia hàng đầu thế giới về công nghệ Trí tuệ nhân tạo và công nghệ chế tạo Robot hình người.",
    logo: "/img/partners/ubtech.png",
  },
  // {
  //   id: 4,
  //   name: "VNG Corporation",
  //   description: "",
  //   logo: "/img/partners/vng.png",
  // },
  // {
  //   id: 5,
  //   name: "Viettel Group",
  //   description: "",
  //   logo: "/img/partners/viettel.png",
  // },
  // { id: 6, name: "Đại học Sư phạm", logo: "/img/partners/hcmue.png" },
  // { id: 7, name: "Đại học Ngoại thương", logo: "/img/partners/ftu.png" },
  // { id: 8, name: "Momo", logo: "/img/partners/momo.png" },
  // { id: 9, name: "ZaloPay", logo: "/img/partners/zalopay.png" },
  // { id: 10, name: "Tiki", logo: "/img/partners/tiki.png" },
];

const PartnersSection = () => {
  return (
    <section className="w-full bg-slate-50/50 py-20 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-10 mb-12">
        <ScrollReveal
          variant={fadeInUp}
          className="flex flex-col items-center text-center"
        >
          <span className="color-primary font-bold tracking-widest text-sm uppercase mb-2">
            Hợp tác & Liên kết
          </span>
          <h2 className="sm:text-4xl text-2xl font-extrabold text-gray-900">
            Đối tác chiến lược của chúng tôi
          </h2>
          <div className="mt-4 h-1.5 w-20 bg-blue-600 rounded-full"></div>
        </ScrollReveal>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <motion.div
          className="flex whitespace-nowrap py-12"
          animate={{ x: [0, "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 30, // Tăng duration nếu muốn chạy chậm hơn
            ease: "linear",
          }}
        >
          {/* First set of partners */}
          <div className="flex items-center justify-center gap-10 px-5">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex flex-col items-center gap-2 bg-white px-8 py-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 shrink-0 w-[320px]"
              >
                <div className="flex items-center justify-center gap-2 w-full">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-16 h-16 object-contain shrink-0"
                  />
                  <span className="text-slate-700 font-bold text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    {partner.name}
                  </span>
                </div>
                {partner.description && (
                  <span className="text-slate-600 font-normal text-sm whitespace-normal text-center wrap-break-word line-clamp-4">
                    {partner.description}
                  </span>
                )}
              </div>
            ))}
          </div>
          {/* Duplicate set for seamless looping */}
          <div className="flex items-center justify-center gap-10 px-5">
            {partners.map((partner) => (
              <div
                key={`dup-${partner.id}`}
                className="flex flex-col items-center gap-2 bg-white px-8 py-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 shrink-0 w-[320px]"
              >
                <div className="flex items-center justify-center gap-2 w-full">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-16 h-16 object-contain shrink-0"
                  />
                  <span className="text-slate-700 font-bold text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    {partner.name}
                  </span>
                </div>
                {partner.description && (
                  <span className="text-slate-600 font-normal text-sm whitespace-normal text-center wrap-break-word line-clamp-4">
                    {partner.description}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Gradient shadows for smooth fade in/out */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-linear-to-r from-slate-50/50 to-transparent z-10"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-linear-to-l from-slate-50/50 to-transparent z-10"></div>
      </div>
    </section>
  );
};

export default PartnersSection;
