import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export function WishlistPage() {
  return (
    <main className="flex-grow pt-[104px] pb-3xl px-gutter max-w-max_width mx-auto w-full">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 font-caption text-caption text-on-surface-variant/70 mb-lg">
        <Link className="hover:text-primary transition-colors" to={ROUTES.HOME}>Home</Link>
        <span>/</span>
        <span className="text-on-surface">Wishlist</span>
      </nav>

      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-lg">
          <span className="material-symbols-outlined text-[40px] text-primary">favorite</span>
        </div>
        <h1 className="font-h2 text-h2 text-on-surface mb-base">Your Wishlist is Empty</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mb-xl">
          Save your favorite items here. Browse our collection and add products you love.
        </p>
        <Link
          to={ROUTES.PRODUCTS}
          className="inline-flex items-center gap-2 bg-primary-container text-on-primary font-label-md text-label-md py-4 px-xl rounded-xl hover:bg-blue-700 transition-colors active:scale-95 shadow-[0px_12px_32px_rgba(37,99,235,0.2)]"
        >
          <span className="material-symbols-outlined">storefront</span>
          Start Shopping
        </Link>
      </div>
    </main>
  );
}
