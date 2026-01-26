interface Student {
  id: number;
  name: string;
  initials: string;
  color: string;
  course: string;
  joinedTime: string;
  status: string;
  statusColor: string;
}

const students: Student[] = [
  {
    id: 1,
    name: 'Lê Văn Hùng',
    initials: 'LH',
    color: 'bg-[#0b8eda]/20 text-[#0b8eda]',
    course: 'Thiết kế UI/UX cơ bản',
    joinedTime: '10 phút trước',
    status: 'Vừa thanh toán',
    statusColor: 'bg-green-100 text-green-700'
  },
  {
    id: 2,
    name: 'Trần Thị Ngọc',
    initials: 'TN',
    color: 'bg-blue-100 text-blue-700',
    course: 'Lập trình Frontend ReactJS',
    joinedTime: '2 giờ trước',
    status: 'Học bổng',
    statusColor: 'bg-blue-100 text-blue-700'
  },
  {
    id: 3,
    name: 'Phạm Minh Anh',
    initials: 'PA',
    color: 'bg-purple-100 text-purple-700',
    course: 'Marketing Kỹ thuật số',
    joinedTime: '5 giờ trước',
    status: 'Đã kích hoạt',
    statusColor: 'bg-green-100 text-green-700'
  },
  {
    id: 4,
    name: 'Quách Thanh Tùng',
    initials: 'QT',
    color: 'bg-orange-100 text-orange-700',
    course: 'Phân tích dữ liệu Python',
    joinedTime: 'Hôm qua',
    status: 'Đã kích hoạt',
    statusColor: 'bg-green-100 text-green-700'
  }
];

const NewStudentsTable = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-[#dbe2e6]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#111518] text-lg font-bold">Học viên mới tham gia</h2>
        <button className="p-2 text-[#607b8a] hover:text-[#0b8eda] transition-colors">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[#607b8a] text-xs font-bold uppercase tracking-wider border-b border-gray-100">
              <th className="pb-4 font-bold">Học viên</th>
              <th className="pb-4 font-bold">Khóa học</th>
              <th className="pb-4 font-bold">Thời gian tham gia</th>
              <th className="pb-4 font-bold">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((student) => (
              <tr
                key={student.id}
                className="group hover:bg-gray-50 transition-colors"
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-8 rounded-full flex items-center justify-center font-bold text-xs ${student.color}`}
                    >
                      {student.initials}
                    </div>
                    <span className="text-sm font-semibold text-[#111518]">
                      {student.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 text-sm text-[#607b8a]">{student.course}</td>
                <td className="py-4 text-sm text-[#607b8a]">{student.joinedTime}</td>
                <td className="py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-bold ${student.statusColor}`}
                  >
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewStudentsTable;
