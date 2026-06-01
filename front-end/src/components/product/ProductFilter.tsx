import { useEffect, useState } from 'react';
import { categoryApi } from '../../api/category.api';
import type { Category } from '../../types/product.type';

interface ProductFilterProps {
  selectedCategory?: string;
  onCategoryChange: (slug: string | undefined) => void;
  sort: string;
  onSortChange: (sort: string) => void;
}

export function ProductFilter({ selectedCategory, onCategoryChange, sort, onSortChange }: ProductFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoryApi.getAll().then(({ data }) => setCategories(data.data || [])).catch(() => {});
  }, []);

  const renderCategoryTree = (cats: Category[], level = 0) => {
    return cats.map(cat => (
      <div key={cat.id}>
        <button
          onClick={() => onCategoryChange(selectedCategory === cat.slug ? undefined : cat.slug)}
          className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
            selectedCategory === cat.slug ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
          }`}
          style={{ paddingLeft: `${12 + level * 16}px` }}
        >
          {cat.name}
        </button>
        {cat.children?.length > 0 && renderCategoryTree(cat.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
      <div>
        <h3 className="font-medium text-gray-900 mb-2">Danh mục</h3>
        <button
          onClick={() => onCategoryChange(undefined)}
          className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
            !selectedCategory ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Tất cả
        </button>
        {renderCategoryTree(categories)}
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-2">Sắp xếp</h3>
        <select
          value={sort}
          onChange={e => onSortChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá: Thấp → Cao</option>
          <option value="price_desc">Giá: Cao → Thấp</option>
          <option value="sold">Bán chạy</option>
        </select>
      </div>
    </div>
  );
}
