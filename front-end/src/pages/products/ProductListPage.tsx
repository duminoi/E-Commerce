import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../api/product.api';
import { ProductGrid } from '../../components/product/ProductGrid';
import { ProductFilter } from '../../components/product/ProductFilter';
import { ProductSearch } from '../../components/product/ProductSearch';
import type { Product } from '../../types/product.type';

export function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | undefined>();
  const [sort, setSort] = useState('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    productApi.getAll({ search: search || undefined, category, sort, page, limit: 20 })
      .then(({ data }) => {
        setProducts(data.data?.items || []);
        setTotalPages(data.data?.meta?.totalPages || 1);
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        console.error('Error response:', err.response?.data);
      })
      .finally(() => setIsLoading(false));
  }, [search, category, sort, page]);

  const startItem = (page - 1) * 20 + 1;
  const endItem = Math.min(page * 20, products.length || 20);

  return (
    <main className="flex-grow pt-[104px] pb-3xl px-gutter max-w-max_width mx-auto w-full">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 font-caption text-caption text-on-surface-variant/70 mb-sm">
        <Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link>
        <span>/</span>
        <span className="text-on-surface">Sản phẩm</span>
        {category && (
          <>
            <span>/</span>
            <span className="text-on-surface">{category}</span>
          </>
        )}
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-lg">
        <h1 className="font-h1 text-h1 text-on-surface">Sản phẩm</h1>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">tune</span>
          Bộ lọc
        </button>
      </div>

      {/* Search */}
      <div className="mb-lg">
        <ProductSearch value={search} onChange={setSearch} />
      </div>

      <div className="flex flex-col lg:flex-row gap-xl">
        {/* Sidebar Filters */}
        <aside className={`w-full lg:w-64 flex-shrink-0 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <ProductFilter
            selectedCategory={category}
            onCategoryChange={(slug) => { setCategory(slug); setPage(1); }}
            sort={sort}
            onSortChange={(s) => { setSort(s); setPage(1); }}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-md mb-lg">
            <p className="font-body-md text-body-md text-on-surface-variant mb-md sm:mb-0">
              Hiển thị {startItem}–{endItem} sản phẩm
            </p>
            <div className="flex items-center gap-lg w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-sm">
                <label className="font-caption text-caption text-on-surface-variant">Sắp xếp:</label>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="bg-surface-container-low border border-outline-variant/30 rounded-lg text-body-md focus:ring-primary focus:border-primary py-1.5 pl-3 pr-8"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá: Thấp → Cao</option>
                  <option value="price_desc">Giá: Cao → Thấp</option>
                  <option value="sold">Bán chạy</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <ProductGrid products={products} isLoading={isLoading} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-sm mt-xl">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`w-10 h-10 rounded-lg border border-outline-variant/50 flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-colors bg-surface-container-lowest ${
                  page === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                // Show first, last, current, and neighbors
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-body-md transition-colors ${
                        page === pageNum
                          ? 'bg-primary text-white font-medium'
                          : 'border border-outline-variant/50 text-on-surface-variant hover:border-primary hover:text-primary bg-surface-container-lowest'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === page - 2 || pageNum === page + 2) {
                  return <span key={pageNum} className="text-on-surface-variant px-1">...</span>;
                }
                return null;
              })}

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`w-10 h-10 rounded-lg border border-outline-variant/50 flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-colors bg-surface-container-lowest ${
                  page === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}