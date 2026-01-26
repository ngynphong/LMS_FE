import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { topics } from '../../data/questions';
import type { QuestionDifficulty, QuestionType } from '../../types/question';

const QuestionFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    topic: '',
    difficulty: '' as QuestionDifficulty | '',
    type: 'multiple_choice' as QuestionType,
    content: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
    explanation: ''
  });

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to save question
    console.log('Saving question:', formData);
    navigate('/teacher/questions');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className=" border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            to="/teacher/questions"
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h2 className="text-xl font-bold text-[#111518]">
            {isEditMode ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
          </h2>
        </div>
        <div className="flex gap-3">
          <Link
            to="/teacher/questions"
            className="px-5 py-2 text-sm font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
          >
            Hủy
          </Link>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-sm font-bold bg-[#0074bd] hover:bg-[#0074bd]/90 text-white rounded-lg shadow-sm transition-all"
          >
            Lưu câu hỏi
          </button>
        </div>
      </header>

      {/* Form Content */}
      <div className="p-8 max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Topic & Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#111518]">
                  Chủ đề <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full appearance-none px-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-[#0074bd] text-sm pr-10"
                    required
                  >
                    <option value="" disabled>Chọn chủ đề</option>
                    {topics.map(topic => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">expand_more</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#111518]">
                  Mức độ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as QuestionDifficulty })}
                    className="w-full appearance-none px-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-[#0074bd] text-sm pr-10"
                    required
                  >
                    <option value="" disabled>Chọn mức độ</option>
                    <option value="easy">Dễ</option>
                    <option value="medium">Vừa</option>
                    <option value="hard">Khó</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">expand_more</span>
                </div>
              </div>
            </div>

            {/* Question Content */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#111518]">
                Nội dung câu hỏi <span className="text-red-500">*</span>
              </label>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                {/* Simple toolbar */}
                <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-1">
                  <button type="button" className="p-1.5 hover:bg-slate-200 rounded transition-colors" title="In đậm">
                    <span className="material-symbols-outlined text-xl">format_bold</span>
                  </button>
                  <button type="button" className="p-1.5 hover:bg-slate-200 rounded transition-colors" title="In nghiêng">
                    <span className="material-symbols-outlined text-xl">format_italic</span>
                  </button>
                  <div className="w-px h-6 bg-slate-300 mx-1 self-center"></div>
                  <button type="button" className="p-1.5 hover:bg-slate-200 rounded transition-colors" title="Danh sách">
                    <span className="material-symbols-outlined text-xl">format_list_bulleted</span>
                  </button>
                  <button type="button" className="p-1.5 hover:bg-slate-200 rounded transition-colors" title="Chèn ảnh">
                    <span className="material-symbols-outlined text-xl">image</span>
                  </button>
                </div>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-4 bg-transparent border-none focus:ring-0 text-sm min-h-[160px] resize-y"
                  placeholder="Nhập nội dung câu hỏi tại đây..."
                  required
                />
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#111518]">
                  Danh sách đáp án <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-slate-500">Chọn nút radio cho đáp án đúng</span>
              </div>

              <div className="space-y-3">
                {['A', 'B', 'C', 'D'].map((letter, index) => (
                  <div
                    key={letter}
                    className={`flex items-center gap-4 p-3 bg-slate-50 rounded-lg border transition-all ${
                      formData.correctAnswerIndex === index
                        ? 'border-[#0074bd]/50 bg-[#0074bd]/5'
                        : 'border-transparent hover:border-[#0074bd]/30'
                    }`}
                  >
                    <div className="flex-none">
                      <input
                        type="radio"
                        name="correct_answer"
                        checked={formData.correctAnswerIndex === index}
                        onChange={() => setFormData({ ...formData, correctAnswerIndex: index })}
                        className="w-5 h-5 text-[#0074bd] border-slate-300 focus:ring-[#0074bd]"
                      />
                    </div>
                    <span className="flex-none font-bold text-sm text-slate-500">{letter}.</span>
                    <input
                      type="text"
                      value={formData.options[index]}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-0"
                      placeholder={`Nhập nội dung đáp án ${letter}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <div className="space-y-2 pt-4">
              <label className="text-sm font-bold text-[#111518]">
                Giải thích đáp án (Tùy chọn)
              </label>
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                className="w-full p-4 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-[#0074bd] text-sm min-h-[100px]"
                placeholder="Nhập lời giải thích cho sinh viên sau khi hoàn thành câu hỏi..."
              />
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-8 text-center">
        <p className="text-xs text-slate-400">© 2024 Edu-Lms Learning Management System</p>
      </footer>
    </div>
  );
};

export default QuestionFormPage;
