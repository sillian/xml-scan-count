export interface Product {
  id: string;
  code: string;
  ean: string;
  description: string;
  unit: string;
  expectedQuantity: number;
  countedQuantity: number;
  unitValue: number;
}

export type ProductStatus = 'pending' | 'complete' | 'over' | 'partial';

export interface InvoiceInfo {
  number: string;
  series: string;
  issueDate: string;
  supplier: string;
  supplierCnpj: string;
  totalValue: number;
}
