import { useState } from "react";
import { IoFilter } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { FaSignal } from "react-icons/fa";

const FilterSidebar = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Công nghệ thông tin",
  ]);
  const [selectedLevel, setSelectedLevel] = useState<string>("");

  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white p-6 rounded-xl border border-gray-100 sticky top-24">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-900 text-lg font-bold">Bộ lọc</h2>
            <span className="material-symbols-outlined text-gray-500">
              <IoFilter />
            </span>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 color-primary">
              <span className="material-symbols-outlined text-[20px]">
                <BiCategory />
              </span>
              <p className="text-sm font-bold">Chủ đề</p>
            </div>
            <div className="flex flex-col gap-2 pl-2">
              {[
                "Tiếng Việt",
                "Toán",
                "Tự nhiên và Xã hội",
                "Khoa học",
                "Lịch sử và Địa lí",
                "Đạo đức",
                "Âm nhạc",
                "Mỹ thuật",
                "Tiếng Anh",
                "Tin học",
              ].map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="rounded color-primary focus:ring-[#0077BE] h-4 w-4"
                  />
                  <span className="text-sm text-gray-700 group-hover:color-primary transition-colors">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 color-primary">
              <span className="material-symbols-outlined text-[20px]">
                <FaSignal />
              </span>
              <p className="text-sm font-bold">Cấp độ</p>
            </div>
            <div className="flex flex-col gap-2 pl-2">
              {["Cơ bản", "Trung cấp", "Nâng cao"].map((level) => (
                <label
                  key={level}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="level"
                    checked={selectedLevel === level}
                    onChange={() => setSelectedLevel(level)}
                    className="color-primary focus:ring-[#0077BE] h-4 w-4"
                  />
                  <span className="text-sm text-gray-700">{level}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="w-full flex items-center justify-center rounded-lg h-11 color-primary-bg text-white text-sm font-bold shadow-md hover:color-primary/90 transition-all mt-4">
            <span>Áp dụng</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
