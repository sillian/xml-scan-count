import { useState, useCallback } from 'react';
import { Product, InvoiceInfo } from '@/types/product';
import { parseNFeXML } from '@/utils/xmlParser';
import { FileUpload } from '@/components/FileUpload';
import { InvoiceHeader } from '@/components/InvoiceHeader';
import { BarcodeInput } from '@/components/BarcodeInput';
import { ProgressSummary } from '@/components/ProgressSummary';
import { ProductList } from '@/components/ProductList';
import { toast } from '@/hooks/use-toast';
import { ScanBarcode, RefreshCw } from 'lucide-react';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [invoiceInfo, setInvoiceInfo] = useState<InvoiceInfo | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const handleFileLoad = useCallback((content: string) => {
    try {
      const { products: parsedProducts, invoiceInfo: parsedInfo } = parseNFeXML(content);
      setProducts(parsedProducts);
      setInvoiceInfo(parsedInfo);
      toast({
        title: 'XML carregado com sucesso!',
        description: `${parsedProducts.length} produtos encontrados na nota.`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao processar XML',
        description: error instanceof Error ? error.message : 'Arquivo inválido',
        variant: 'destructive',
      });
    }
  }, []);

  const handleScan = useCallback((barcode: string) => {
    const product = products.find(
      (p) => p.ean === barcode || p.code === barcode
    );

    if (product) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? { ...p, countedQuantity: p.countedQuantity + 1 }
            : p
        )
      );
      setHighlightedId(product.id);
      setTimeout(() => setHighlightedId(null), 1000);

      const newCount = product.countedQuantity + 1;
      if (newCount === product.expectedQuantity) {
        toast({
          title: 'Produto conferido!',
          description: product.description,
        });
      } else if (newCount > product.expectedQuantity) {
        toast({
          title: 'Atenção: Quantidade excedente!',
          description: `${product.description} - ${newCount}/${product.expectedQuantity}`,
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Produto não encontrado',
        description: `Código: ${barcode}`,
        variant: 'destructive',
      });
    }
  }, [products]);

  const handleQuantityChange = useCallback((id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, countedQuantity: Math.max(0, p.countedQuantity + delta) }
          : p
      )
    );
  }, []);

  const handleReset = () => {
    setProducts([]);
    setInvoiceInfo(null);
    setHighlightedId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <ScanBarcode className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Conferência de XML
                </h1>
                <p className="text-sm text-muted-foreground">
                  Leitura e contagem de produtos
                </p>
              </div>
            </div>

            {invoiceInfo && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Nova Conferência
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {!invoiceInfo ? (
          <div className="max-w-xl mx-auto mt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Iniciar Conferência
              </h2>
              <p className="text-muted-foreground">
                Carregue o arquivo XML da nota fiscal para começar
              </p>
            </div>
            <FileUpload onFileLoad={handleFileLoad} />
          </div>
        ) : (
          <div className="space-y-6">
            <InvoiceHeader invoiceInfo={invoiceInfo} />

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <BarcodeInput onScan={handleScan} />
                <ProgressSummary products={products} />
              </div>

              <div className="lg:col-span-2">
                <ProductList
                  products={products}
                  highlightedId={highlightedId}
                  onQuantityChange={handleQuantityChange}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
