import { Product, InvoiceInfo } from '@/types/product';

export function parseNFeXML(xmlString: string): { products: Product[]; invoiceInfo: InvoiceInfo } {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  // Check for parsing errors
  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Erro ao processar o arquivo XML. Verifique se o arquivo é válido.');
  }

  // Extract invoice info
  const ide = xmlDoc.querySelector('ide');
  const emit = xmlDoc.querySelector('emit');
  const total = xmlDoc.querySelector('total ICMSTot');

  const invoiceInfo: InvoiceInfo = {
    number: ide?.querySelector('nNF')?.textContent || '',
    series: ide?.querySelector('serie')?.textContent || '',
    issueDate: formatDate(ide?.querySelector('dhEmi')?.textContent || ''),
    supplier: emit?.querySelector('xNome')?.textContent || '',
    supplierCnpj: formatCnpj(emit?.querySelector('CNPJ')?.textContent || ''),
    totalValue: parseFloat(total?.querySelector('vNF')?.textContent || '0'),
  };

  // Extract products
  const detElements = xmlDoc.querySelectorAll('det');
  const products: Product[] = [];

  detElements.forEach((det, index) => {
    const prod = det.querySelector('prod');
    if (prod) {
      const product: Product = {
        id: `${index + 1}`,
        code: prod.querySelector('cProd')?.textContent || '',
        ean: prod.querySelector('cEAN')?.textContent || prod.querySelector('cEANTrib')?.textContent || '',
        description: prod.querySelector('xProd')?.textContent || '',
        unit: prod.querySelector('uCom')?.textContent || '',
        expectedQuantity: parseFloat(prod.querySelector('qCom')?.textContent || '0'),
        countedQuantity: 0,
        unitValue: parseFloat(prod.querySelector('vUnCom')?.textContent || '0'),
      };
      products.push(product);
    }
  });

  return { products, invoiceInfo };
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

function formatCnpj(cnpj: string): string {
  if (!cnpj || cnpj.length !== 14) return cnpj;
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}
