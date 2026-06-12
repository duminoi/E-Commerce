import { useState, useEffect } from 'react';

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductSearch({ value, onChange }: ProductSearchProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 400);
    return () => clearTimeout(timer);
  }, [localValue]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="relative w-full">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-on-surface-variant pointer-events-none">
        search
      </span>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Tìm kiếm sản phẩm..."
        className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-12 pr-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
      />
      {localValue && (
        <button
          onClick={() => {
            setLocalValue('');
            onChange('');
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-on-surface-variant hover:text-on-surface transition-colors"
        >
          close
        </button>
      )}
    </div>
  );
}