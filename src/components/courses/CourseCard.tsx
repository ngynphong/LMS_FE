import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

interface CourseCardProps {
  id: number;
  title: string;
  category: string;
  image: string;
  duration: string;
  rating: number;
  reviews: number;
  price: string;
}

const CourseCard = ({ id, title, category, image, duration, rating, reviews, price }: CourseCardProps) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
      <div className="relative h-44 w-full overflow-hidden">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          src={image}
          alt={title}
        />
        <div className="absolute top-3 left-3 bg-[#0077BE] text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
          {category}
        </div>
      </div>
      <div className="p-5 flex flex-col gap-3">
        <h3 className="text-gray-900 font-bold text-base leading-snug line-clamp-2 h-12">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <span className="material-symbols-outlined text-sm">schedule</span> {duration}
          <span className="material-symbols-outlined text-sm ml-2"><FaStar className="text-yellow-500" /></span> {rating} ({reviews})
        </div>
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100">
          <span className="text-[#0077BE] font-bold text-lg">{price}</span>
          <Link className="text-[#0077BE] text-sm font-bold hover:underline" to={`/courses/${id}`}>
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
