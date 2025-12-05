import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface ProductListProps {
  products: Product[];
  highlightedId: string | null;
  onQuantityChange: (id: string, delta: number) => void;
}

export function ProductList({ products, highlightedId, onQuantityChange }: ProductListProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'complete' | 'divergent'>('all');

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.description.toLowerCase().includes(search.toLowerCase()) ||
      product.code.toLowerCase().includes(search.toLowerCase()) ||
      product.ean.includes(search);

    if (!matchesSearch) return false;

    switch (filter) {
      case 'pending':
        return product.countedQuantity === 0;
      case 'complete':
        return product.countedQuantity === product.expectedQuantity;
      case 'divergent':
        return product.countedQuantity > product.expectedQuantity;
      default:
        return true;
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produto..."
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Todos' },
            { value: 'pending', label: 'Pendentes' },
            { value: 'complete', label: 'Conferidos' },
            { value: 'divergent', label: 'Divergentes' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isHighlighted={highlightedId === product.id}
            onQuantityChange={onQuantityChange}
          />
        ))}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum produto encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
