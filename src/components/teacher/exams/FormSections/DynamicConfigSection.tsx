import type { DynamicConfig } from "@/types/quiz";
import type { ApiLesson } from "@/types/learningTypes";
import { IoIosAddCircle } from "react-icons/io";
import { IoClose } from "react-icons/io5";

interface DynamicConfigSectionProps {
  isEditMode: boolean;
  isDynamic: boolean;
  setIsDynamic: (val: boolean) => void;
  dynamicConfigs: DynamicConfig[];
  setDynamicConfigs: (configs: DynamicConfig[]) => void;
  lessons: ApiLesson[];
  selectedLessonId: string;
}

const DynamicConfigSection = ({
  isEditMode,
  isDynamic,
  setIsDynamic,
  dynamicConfigs,
  setDynamicConfigs,
  lessons,
  selectedLessonId,
}: DynamicConfigSectionProps) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#111518]">Cấu hình câu hỏi</h3>
        {!isEditMode && (
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-bold ${!isDynamic ? "text-[#0074bd]" : "text-slate-400"}`}
            >
              Thủ công
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDynamic}
                onChange={(e) => setIsDynamic(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E90FF]"></div>
            </label>
            <span
              className={`text-sm font-bold ${isDynamic ? "text-[#1E90FF]" : "text-slate-400"}`}
            >
              Tự động (Dynamic)
            </span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="space-y-4 font-black">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-slate-500 font-medium">
              Hệ thống sẽ tự động chọn câu hỏi ngẫu nhiên dựa trên các cấu hình
              dưới đây.
            </p>
            <button
              type="button"
              onClick={() =>
                setDynamicConfigs([
                  ...dynamicConfigs,
                  {
                    targetLessonId: "",
                    difficulty: "EASY",
                    quantity: 10,
                    scorePerQuestion: 1,
                  },
                ])
              }
              className="text-sm font-bold text-[#1E90FF] hover:text-[#0074bd] flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-100 cursor-pointer"
            >
              <span className="text-base">
                <IoIosAddCircle />
              </span>
              Thêm cấu hình
            </button>
          </div>

          <div className="space-y-4">
            {dynamicConfigs.map((config, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-xl bg-slate-50 relative group"
              >
                {dynamicConfigs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newConfigs = [...dynamicConfigs];
                      newConfigs.splice(index, 1);
                      setDynamicConfigs(newConfigs);
                    }}
                    className="absolute -top-3 -right-3 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border shadow-sm cursor-pointer"
                    title="Xóa cấu hình"
                  >
                    <span className="text-sm">
                      <IoClose />
                    </span>
                  </button>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Độ khó
                  </label>
                  <select
                    value={config.difficulty}
                    onChange={(e) => {
                      const newConfigs = [...dynamicConfigs];
                      newConfigs[index].difficulty = e.target.value as any;
                      setDynamicConfigs(newConfigs);
                    }}
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:ring-[#1E90FF] focus:border-[#1E90FF] font-medium"
                  >
                    <option value="EASY">Dễ</option>
                    <option value="MEDIUM">Vừa</option>
                    <option value="HARD">Khó</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Số lượng câu
                  </label>
                  <input
                    type="number"
                    value={config.quantity}
                    onChange={(e) => {
                      const newConfigs = [...dynamicConfigs];
                      newConfigs[index].quantity =
                        parseInt(e.target.value) || 0;
                      setDynamicConfigs(newConfigs);
                    }}
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:ring-[#1E90FF] focus:border-[#1E90FF] font-medium"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Điểm mỗi câu
                  </label>
                  <input
                    type="number"
                    value={config.scorePerQuestion}
                    onChange={(e) => {
                      const newConfigs = [...dynamicConfigs];
                      newConfigs[index].scorePerQuestion =
                        parseFloat(e.target.value) || 0;
                      setDynamicConfigs(newConfigs);
                    }}
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:ring-[#1E90FF] focus:border-[#1E90FF] font-medium"
                    min={0.5}
                    step={0.5}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Nguồn câu hỏi (Bài học)
                  </label>
                  <select
                    value={config.targetLessonId || ""}
                    onChange={(e) => {
                      const newConfigs = [...dynamicConfigs];
                      newConfigs[index].targetLessonId = e.target.value;
                      setDynamicConfigs(newConfigs);
                    }}
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:ring-[#1E90FF] focus:border-[#1E90FF] font-medium"
                  >
                    <option value="">
                      (Tự động theo:{" "}
                      {lessons.find((l) => l.id === selectedLessonId)?.title ||
                        "Bài học hiện tại"}
                      )
                    </option>
                    {lessons.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicConfigSection;
