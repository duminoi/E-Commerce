import { useState, useEffect } from 'react';
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

  useEffect(() => {
    setIsLoading(true);
    productApi.getAll({ search: search || undefined, category, sort, page, limit: 20 })
      .then(({ data }) => {
        setProducts(data.data?.items || []);
        setTotalPages(data.data?.meta?.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [search, category, sort, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <ProductSearch value={search} onChange={setSearch} />
      </div>
      <div className="flex gap-6">
        <aside className="w-64 flex-shrink-0">
          <ProductFilter selectedCategory={category} onCategoryChange={setCategory} sort={sort} onSortChange={setSort} />
        </aside>
        <main className="flex-1">
          <ProductGrid products={products} isLoading={isLoading} />
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1.5 rounded text-sm ${
                    page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
