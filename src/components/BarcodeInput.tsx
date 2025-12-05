import { useState, useRef, useEffect } from 'react';
import { ScanBarcode, Keyboard } from 'lucide-react';

interface BarcodeInputProps {
  onScan: (barcode: string) => void;
  disabled?: boolean;
}

export function BarcodeInput({ onScan, disabled }: BarcodeInputProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus on mount
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      onScan(value.trim());
      setValue('');
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <ScanBarcode className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Leitura de Código</h2>
          <p className="text-sm text-muted-foreground">
            Use o leitor ou digite o código manualmente
          </p>
        </div>
      </div>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder="Aguardando leitura..."
          className={`w-full h-14 px-4 pr-12 text-lg font-mono rounded-lg border-2 transition-all outline-none
            ${isFocused 
              ? 'border-accent bg-accent/5 shadow-[0_0_0_4px_hsl(var(--accent)/0.1)]' 
              : 'border-border bg-background'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            placeholder:text-muted-foreground/50
          `}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {isFocused ? (
            <div className="w-2 h-5 bg-accent animate-pulse rounded-full" />
          ) : (
            <Keyboard className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {isFocused && (
        <p className="mt-2 text-sm text-accent flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Pronto para receber código
        </p>
      )}
    </div>
  );
}
