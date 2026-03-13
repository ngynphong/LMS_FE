import { format, isValid } from "date-fns";
import { vi } from "date-fns/locale";
import { MdEvent } from "react-icons/md";

interface SettingsSectionProps {
  formData: {
    duration: number;
    maxAttempts: number;
    passingScore: number;
    type: "PRACTICE" | "QUIZ";
    closeTime: string;
    showScoreAfterSubmit: boolean;
    showResultAfterSubmit: boolean;
    shuffleQuestions: boolean;
  };
  setFormData: (data: any) => void;
}

const SettingsSection = ({ formData, setFormData }: SettingsSectionProps) => {
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-lg font-bold text-[#111518]">Cấu hình</h3>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#111518] mb-2">
              Thời gian làm bài (phút)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration: parseInt(e.target.value),
                })
              }
              className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none font-medium"
              min={1}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#111518] mb-2">
              Số lần thử tối đa
            </label>
            <select
              value={formData.type === "PRACTICE" ? "" : formData.maxAttempts}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxAttempts:
                    e.target.value === "" ? 1 : parseInt(e.target.value),
                })
              }
              disabled={formData.type === "PRACTICE"}
              className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none disabled:bg-slate-100 disabled:text-slate-500 font-medium"
            >
              {formData.type === "PRACTICE" && (
                <option value="">Không giới hạn</option>
              )}
              {[1, 2, 3, 4, 5, 10].map((num) => (
                <option key={num} value={num}>
                  {num} lần
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#111518] mb-2">
              Điểm chuẩn (%)
            </label>
            <input
              type="number"
              value={formData.passingScore}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  passingScore: parseInt(e.target.value),
                })
              }
              className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none font-medium"
              min={0}
              max={100}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#111518] mb-2">
              Thời gian đóng đề (Hạn chót)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="date"
                value={
                  formData.closeTime ? formData.closeTime.split("T")[0] : ""
                }
                onChange={(e) => {
                  const date = e.target.value;
                  const time = formData.closeTime
                    ? formData.closeTime.split("T")[1]
                    : "00:00";
                  if (date) {
                    setFormData({
                      ...formData,
                      closeTime: `${date}T${time}`,
                    });
                  } else {
                    setFormData({ ...formData, closeTime: "" });
                  }
                }}
                className="flex-1 h-12 rounded-lg border border-slate-200 bg-white px-4 focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none font-medium"
                min={today}
              />
              <input
                type="time"
                value={
                  formData.closeTime
                    ? formData.closeTime.split("T")[1]?.substring(0, 5)
                    : ""
                }
                onChange={(e) => {
                  const time = e.target.value;
                  const date = formData.closeTime
                    ? formData.closeTime.split("T")[0]
                    : "";
                  if (date && time) {
                    setFormData({
                      ...formData,
                      closeTime: `${date}T${time}`,
                    });
                  }
                }}
                className="min-w-36 h-12 rounded-lg border border-slate-200 bg-white px-4 focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none font-medium"
              />
            </div>

            {formData.closeTime && isValid(new Date(formData.closeTime)) && (
              <p className="text-sm text-[#1E90FF] font-medium flex items-center gap-1 bg-blue-50 w-fit px-2 py-1 rounded">
                <span className="text-lg">
                  <MdEvent />
                </span>
                {format(
                  new Date(formData.closeTime),
                  "HH:mm 'ngày' dd/MM/yyyy (EEEE)",
                  { locale: vi },
                )}
              </p>
            )}
            {!formData.closeTime && (
              <p className="text-xs text-slate-500 mt-1">
                Để trống nếu không có hạn chót
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 justify-center">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.showScoreAfterSubmit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    showScoreAfterSubmit: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded border-gray-300 text-[#1E90FF] focus:ring-[#1E90FF] cursor-pointer"
              />
              <span className="text-sm font-semibold text-[#111518] group-hover:text-[#1E90FF] transition-colors">
                Hiển thị điểm sau khi nộp
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.showResultAfterSubmit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    showResultAfterSubmit: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded border-gray-300 text-[#1E90FF] focus:ring-[#1E90FF] cursor-pointer"
              />
              <span className="text-sm font-semibold text-[#111518] group-hover:text-[#1E90FF] transition-colors">
                Hiển thị đáp án chi tiết
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.shuffleQuestions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shuffleQuestions: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded border-gray-300 text-[#1E90FF] focus:ring-[#1E90FF] cursor-pointer"
              />
              <span className="text-sm font-semibold text-[#111518] group-hover:text-[#1E90FF] transition-colors">
                Xáo trộn câu hỏi
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
