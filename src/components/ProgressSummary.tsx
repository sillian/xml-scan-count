import { Product } from '@/types/product';
import { CheckCircle2, Clock, AlertCircle, Package } from 'lucide-react';

interface ProgressSummaryProps {
  products: Product[];
}

export function ProgressSummary({ products }: ProgressSummaryProps) {
  const total = products.length;
  const complete = products.filter(p => p.countedQuantity === p.expectedQuantity).length;
  const partial = products.filter(p => p.countedQuantity > 0 && p.countedQuantity < p.expectedQuantity).length;
  const pending = products.filter(p => p.countedQuantity === 0).length;
  const divergent = products.filter(p => p.countedQuantity > p.expectedQuantity).length;

  const progress = total > 0 ? (complete / total) * 100 : 0;

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Progresso</h2>
        <span className="text-2xl font-bold font-mono text-foreground">
          {complete}/{total}
        </span>
      </div>

      <div className="h-3 bg-muted rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-accent to-success transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold font-mono text-foreground">{complete}</p>
            <p className="text-xs text-muted-foreground">Conferidos</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold font-mono text-foreground">{partial}</p>
            <p className="text-xs text-muted-foreground">Parciais</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold font-mono text-foreground">{pending}</p>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <p className="text-2xl font-bold font-mono text-foreground">{divergent}</p>
            <p className="text-xs text-muted-foreground">Divergentes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
