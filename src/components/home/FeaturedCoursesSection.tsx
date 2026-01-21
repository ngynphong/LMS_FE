import { Link } from 'react-router-dom';
import courses from '../../data/courses';
import { FaArrowRight, FaStar } from "react-icons/fa";

const FeaturedCoursesSection = () => {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-[1280px] mx-auto px-10">
      <div className="flex items-end justify-between mb-10">
        <div className="flex flex-col gap-2">
          <span className="text-[#0077BE] font-bold tracking-widest text-sm uppercase">Bộ sưu tập</span>
          <h2 className="text-3xl font-extrabold text-gray-900">Khóa học nổi bật</h2>
        </div>
        <Link className="flex items-center gap-1 text-[#0077BE] font-bold hover:gap-2 transition-all" to="/courses">
          Xem tất cả <span className="material-symbols-outlined"><FaArrowRight /></span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
            <div className="relative h-48 overflow-hidden">
              <img 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                src={course.image} 
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-[#0077BE]">
                {course.category}
              </div>
            </div>
            <div className="p-5 flex flex-col gap-2">
              <h3 className="font-bold text-gray-900 line-clamp-2 min-h-12 group-hover:text-[#0077BE] transition-colors">
                {course.title}
              </h3>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="material-symbols-outlined text-sm">person</span> {course.instructor}
              </div>
              <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 font-bold">{course.rating}</span>
                  <span className="material-symbols-outlined text-sm text-yellow-500"><FaStar /></span>
                </div>
                <span className="text-[#0077BE] font-bold text-lg">{course.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default FeaturedCoursesSection;
