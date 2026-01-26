interface StatItem {
  icon: string;
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'neutral' | 'negative';
}

const statsData: StatItem[] = [
  { icon: 'groups', label: 'Tổng học viên', value: '1,240', change: '+12%', changeType: 'positive' },
  { icon: 'local_library', label: 'Khóa học đang bán', value: '5', change: '0%', changeType: 'neutral' },
  { icon: 'star_rate', label: 'Đánh giá trung bình', value: '4.8/5', change: '+0.2%', changeType: 'positive' },
  // { icon: 'payments', label: 'Doanh thu tháng này', value: '45.000.000đ', change: '+15%', changeType: 'positive' }
];

const QuickStats = () => {
  const getChangeColor = (type: StatItem['changeType']) => {
    switch (type) {
      case 'positive':
        return 'text-[#078836]';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-[#607b8a]';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl border border-[#dbe2e6] flex flex-col gap-2"
        >
          <div className="flex justify-between items-start">
            <span className="p-2 bg-[#0b8eda]/10 rounded-lg text-[#0b8eda] material-symbols-outlined">
              {stat.icon}
            </span>
            <span className={`text-xs font-bold ${getChangeColor(stat.changeType)}`}>
              {stat.change}
            </span>
          </div>
          <p className="text-[#607b8a] text-sm font-medium">{stat.label}</p>
          <p className="text-[#111518] text-2xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
