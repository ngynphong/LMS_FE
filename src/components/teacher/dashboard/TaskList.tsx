interface Task {
  id: number;
  title: string;
  subtitle: string;
  action: string;
  status: 'pending' | 'waiting';
}

const tasks: Task[] = [
  {
    id: 1,
    title: 'Phê duyệt 5 bài tập mới',
    subtitle: 'Khóa học: Thiết kế UI/UX cơ bản',
    action: 'Làm ngay',
    status: 'pending'
  },
  {
    id: 2,
    title: 'Trả lời 3 câu hỏi thảo luận',
    subtitle: 'Học viên đang chờ phản hồi',
    action: 'Phản hồi',
    status: 'pending'
  },
  {
    id: 3,
    title: 'Cập nhật tài liệu chương 4',
    subtitle: 'Đã lên lịch nhắc nhở',
    action: 'Chờ',
    status: 'waiting'
  }
];

const TaskList = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-[#dbe2e6] flex flex-col h-full">
      <h2 className="text-[#111518] text-lg font-bold mb-6">Việc cần làm</h2>

      <div className="flex flex-col gap-4 flex-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 ${
              task.status === 'waiting' ? 'opacity-60' : ''
            }`}
          >
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-[#111518]">{task.title}</p>
              <p className="text-xs text-[#607b8a]">{task.subtitle}</p>
            </div>
            <button
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                task.status === 'pending'
                  ? 'text-[#0b8eda] bg-[#0b8eda]/10 hover:bg-[#0b8eda]/20'
                  : 'text-[#607b8a] bg-gray-200'
              }`}
            >
              {task.action}
            </button>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 border border-dashed border-[#dbe2e6] dark:border-gray-700 rounded-lg text-xs font-medium text-[#607b8a] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
        Xem tất cả nhiệm vụ
      </button>
    </div>
  );
};

export default TaskList;
