
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: string;
  to: string;
  gradientClass?: string;
}

const CategoryCard = ({ title, description, icon, to, gradientClass = 'from-cosmic-deep-purple to-cosmic-bright-purple' }: CategoryCardProps) => {
  return (
    <Link 
      to={to}
      className="cosmic-card flex flex-col transform hover:scale-105 transition-transform duration-300 h-full"
    >
      <div className={`p-6 rounded-t-lg bg-gradient-to-br ${gradientClass}`}>
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-2 text-gray-100">{title}</h3>
        <p className="text-gray-400 flex-grow">{description}</p>
        <div className="mt-4">
          <span className="text-cosmic-gold font-medium text-sm flex items-center">
            Explore more
            <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
