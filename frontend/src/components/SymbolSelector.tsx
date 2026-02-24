import type { SymbolItem } from "@/features/common/types";

type SymbolSelectorProps = {
  symbols: SymbolItem[];
  value: string;
  onChange: (nextTicker: string) => void;
};

export function SymbolSelector({ symbols, value, onChange }: SymbolSelectorProps) {
  return (
    <label className="flex w-full flex-col gap-1 sm:inline-flex sm:w-auto sm:flex-row sm:items-center sm:gap-2" htmlFor="dashboardSymbolSelect">
      <span className="text-xs font-semibold text-muted-foreground">종목</span>
      <select
        id="dashboardSymbolSelect"
        className="h-11 w-full rounded-md border-2 border-black bg-card px-3 text-sm font-semibold sm:w-auto"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {symbols.map((symbol) => (
          <option key={symbol.ticker} value={symbol.ticker}>
            {symbol.ticker} - {symbol.name}
          </option>
        ))}
      </select>
    </label>
  );
}
