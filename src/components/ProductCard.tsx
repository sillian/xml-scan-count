import { Product, ProductStatus } from '@/types/product';
import { Package, Check, AlertTriangle, Clock, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  isHighlighted?: boolean;
  onQuantityChange: (id: string, delta: number) => void;
}

function getStatus(product: Product): ProductStatus {
  if (product.countedQuantity === 0) return 'pending';
  if (product.countedQuantity === product.expectedQuantity) return 'complete';
  if (product.countedQuantity > product.expectedQuantity) return 'over';
  return 'partial';
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: 'Pendente',
    bgClass: 'bg-muted',
    textClass: 'text-muted-foreground',
    borderClass: 'border-border',
  },
  partial: {
    icon: Package,
    label: 'Parcial',
    bgClass: 'bg-warning/10',
    textClass: 'text-warning',
    borderClass: 'border-warning/30',
  },
  complete: {
    icon: Check,
    label: 'Conferido',
    bgClass: 'bg-success/10',
    textClass: 'text-success',
    borderClass: 'border-success/30',
  },
  over: {
    icon: AlertTriangle,
    label: 'Excedente',
    bgClass: 'bg-destructive/10',
    textClass: 'text-destructive',
    borderClass: 'border-destructive/30',
  },
};

export function ProductCard({ product, isHighlighted, onQuantityChange }: ProductCardProps) {
  const status = getStatus(product);
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div
      className={cn(
        'bg-card rounded-xl p-4 border-2 transition-all duration-300',
        config.borderClass,
        isHighlighted && 'animate-pulse-success ring-2 ring-accent ring-offset-2'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', config.bgClass, config.textClass)}>
              <StatusIcon className="w-3 h-3 inline mr-1" />
              {config.label}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              #{product.code}
            </span>
          </div>
          
          <h3 className="font-medium text-foreground truncate mb-1">
            {product.description}
          </h3>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {product.ean && (
              <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                EAN: {product.ean}
              </span>
            )}
            <span>{product.unit}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <p className="text-2xl font-bold font-mono text-foreground">
              {product.countedQuantity}
              <span className="text-muted-foreground text-lg"> / {product.expectedQuantity}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => onQuantityChange(product.id, -1)}
              disabled={product.countedQuantity === 0}
              className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => onQuantityChange(product.id, 1)}
              className="w-8 h-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
