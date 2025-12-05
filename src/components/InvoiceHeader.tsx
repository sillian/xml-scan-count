import { InvoiceInfo } from '@/types/product';
import { FileText, Building2, Calendar, Hash } from 'lucide-react';

interface InvoiceHeaderProps {
  invoiceInfo: InvoiceInfo;
}

export function InvoiceHeader({ invoiceInfo }: InvoiceHeaderProps) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Dados da Nota</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-start gap-3">
          <Hash className="w-4 h-4 text-muted-foreground mt-1" />
          <div>
            <p className="text-sm text-muted-foreground">Número / Série</p>
            <p className="font-mono font-medium text-foreground">
              {invoiceInfo.number} / {invoiceInfo.series}
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Calendar className="w-4 h-4 text-muted-foreground mt-1" />
          <div>
            <p className="text-sm text-muted-foreground">Data Emissão</p>
            <p className="font-medium text-foreground">{invoiceInfo.issueDate}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 col-span-1 md:col-span-2">
          <Building2 className="w-4 h-4 text-muted-foreground mt-1" />
          <div>
            <p className="text-sm text-muted-foreground">Fornecedor</p>
            <p className="font-medium text-foreground">{invoiceInfo.supplier}</p>
            <p className="text-sm text-muted-foreground font-mono">{invoiceInfo.supplierCnpj}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
