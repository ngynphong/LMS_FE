import { useState } from 'react';
import { Link } from 'react-router-dom';
import questionsData, { topics } from '../../data/questions';
import type { Question, QuestionDifficulty } from '../../types/question';

const QuestionBankPage = () => {
  const [questions, setQuestions] = useState<Question[]>(questionsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  // Stats
  const totalQuestions = questions.length;
  const multipleChoiceCount = questions.filter(q => q.type === 'multiple_choice').length;
  const essayCount = questions.filter(q => q.type === 'essay').length;

  // Filtered questions
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = topicFilter === 'all' || q.topic === topicFilter;
    const matchesDifficulty = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
    return matchesSearch && matchesTopic && matchesDifficulty;
  });

  const getDifficultyBadge = (difficulty: QuestionDifficulty) => {
    switch (difficulty) {
      case 'easy':
        return { label: 'Dễ', className: 'bg-green-100 text-green-700' };
      case 'medium':
        return { label: 'Vừa', className: 'bg-yellow-100 text-yellow-700' };
      case 'hard':
        return { label: 'Khó', className: 'bg-red-100 text-red-700' };
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-[#111518] text-2xl font-bold tracking-tight">Ngân hàng câu hỏi</h1>
          <p className="text-[#617a89] text-sm mt-1">Quản lý và tạo câu hỏi cho bài kiểm tra</p>
        </div>
        <Link
          to="/teacher/questions/new"
          className="bg-[#0074bd] hover:bg-[#0074bd]/90 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          Thêm câu hỏi mới
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-[#0074bd] text-sm"
              placeholder="Tìm kiếm câu hỏi..."
            />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative min-w-[150px]">
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-[#0074bd] text-sm pr-10"
            >
              <option value="all">Chủ đề: Tất cả</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
          </div>
          <div className="relative min-w-[150px]">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-[#0074bd] text-sm pr-10"
            >
              <option value="all">Mức độ: Tất cả</option>
              <option value="easy">Dễ</option>
              <option value="medium">Vừa</option>
              <option value="hard">Khó</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-[#0074bd]/10 p-3 rounded-lg">
            <span className="material-symbols-outlined text-[#0074bd] text-2xl">quiz</span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Tổng số câu hỏi</p>
            <p className="text-2xl font-bold text-[#111518]">{totalQuestions}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <span className="material-symbols-outlined text-green-600 text-2xl">checklist</span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Câu hỏi trắc nghiệm</p>
            <p className="text-2xl font-bold text-[#111518]">{multipleChoiceCount}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-lg">
            <span className="material-symbols-outlined text-orange-600 text-2xl">edit_note</span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Câu hỏi tự luận</p>
            <p className="text-2xl font-bold text-[#111518]">{essayCount}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nội dung câu hỏi</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Chủ đề</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Độ khó</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày tạo</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredQuestions.map((question) => {
              const badge = getDifficultyBadge(question.difficulty);
              return (
                <tr key={question.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#111518] font-medium line-clamp-1">{question.content}</p>
                    <p className="text-xs text-slate-400">ID: {question.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#111518]">{question.topic}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${badge.className}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500">{question.createdAt}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/teacher/questions/${question.id}/edit`}
                        className="p-1.5 text-[#0074bd] hover:bg-[#0074bd]/10 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(question.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination placeholder */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between">
          <p className="text-sm text-slate-500">Hiển thị {filteredQuestions.length} câu hỏi</p>
        </div>
      </div>
    </div>
  );
};

export default QuestionBankPage;
