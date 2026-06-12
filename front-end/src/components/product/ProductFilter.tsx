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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    sort: true,
  });

  useEffect(() => {
    categoryApi.getAll().then(({ data }) => setCategories(data.data || [])).catch(() => {});
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const renderCategoryTree = (cats: Category[], level = 0) => {
    return cats.map((cat) => (
      <div key={cat.id}>
        <button
          onClick={() => onCategoryChange(selectedCategory === cat.slug ? undefined : cat.slug)}
          className={`w-full text-left flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-all ${
            selectedCategory === cat.slug
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
          }`}
          style={{ paddingLeft: `${12 + level * 16}px` }}
        >
          <span className="material-symbols-outlined text-[18px]">
            {cat.children?.length ? (level === 0 ? 'folder' : 'folder_open') : 'label'}
          </span>
          {cat.name}
        </button>
        {cat.children?.length > 0 && renderCategoryTree(cat.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-lg sticky top-[104px] sidebar-scroll max-h-[calc(100vh-140px)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-lg pb-md border-b border-outline-variant/30">
        <h2 className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">tune</span>
          Bộ lọc
        </h2>
        <button
          onClick={() => onCategoryChange(undefined)}
          className="font-caption text-caption text-primary hover:underline"
        >
          Xóa tất cả
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-lg pb-lg border-b border-outline-variant/30">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between mb-md"
        >
          <h3 className="font-label-md text-label-md text-on-surface">Danh mục</h3>
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
            {expandedSections.category ? 'expand_less' : 'expand_more'}
          </span>
        </button>
        {expandedSections.category && (
          <div className="space-y-1">
            <button
              onClick={() => onCategoryChange(undefined)}
              className={`w-full text-left flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-all ${
                !selectedCategory
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">apps</span>
              Tất cả
            </button>
            {renderCategoryTree(categories)}
          </div>
        )}
      </div>

      {/* Sort */}
      <div className="mb-lg">
        <button
          onClick={() => toggleSection('sort')}
          className="w-full flex items-center justify-between mb-md"
        >
          <h3 className="font-label-md text-label-md text-on-surface">Sắp xếp</h3>
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
            {expandedSections.sort ? 'expand_less' : 'expand_more'}
          </span>
        </button>
        {expandedSections.sort && (
          <div className="space-y-1">
            {[
              { value: 'newest', label: 'Mới nhất', icon: 'schedule' },
              { value: 'price_asc', label: 'Giá: Thấp → Cao', icon: 'arrow_upward' },
              { value: 'price_desc', label: 'Giá: Cao → Thấp', icon: 'arrow_downward' },
              { value: 'sold', label: 'Bán chạy', icon: 'local_fire_department' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={`w-full text-left flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-all ${
                  sort === option.value
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}