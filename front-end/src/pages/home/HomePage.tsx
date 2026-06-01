import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../utils/constants';

export function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Chào mừng đến với E-Shop
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Nền tảng thương mại điện tử — Dự án học tập NestJS
      </p>
      <Link to={ROUTES.PRODUCTS}>
        <Button size="lg">Xem sản phẩm</Button>
      </Link>
    </div>
  );
}
