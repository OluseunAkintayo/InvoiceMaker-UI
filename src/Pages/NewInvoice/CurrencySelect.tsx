import React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENCIES, ICurrency } from "./currencies";

interface ICurrencySelect {
  id: string;
  /** Selected ISO currency code, or "" for none. */
  value: string;
  onChange: (code: string) => void;
  onBlur: () => void;
  invalid?: boolean;
  describedBy?: string;
  inputClassName: string;
}

/** Case- and accent-insensitive ("zloty" finds "Złoty"). */
const normalize = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/ł/g, "l").toLowerCase();

const SEARCH_INDEX = CURRENCIES.map((c) => ({
  currency: c,
  name: normalize(c.name),
  words: normalize(c.name).split(/[\s-]+/),
  // Lets "hong kong" or "south af" match across word boundaries.
  code: c.code.toLowerCase(),
  symbol: normalize(c.symbol),
}));

/** Matches on name, ISO code or symbol. Results keep the list's A–Z order. */
const search = (query: string): ICurrency[] => {
  const q = normalize(query.trim());
  if (!q) return CURRENCIES;
  return SEARCH_INDEX
    // Match the start of any word ("dollar", "hong kong") or of the whole name, plus code and symbol.
    .filter((c) => c.code.startsWith(q) || c.symbol === q || c.name.startsWith(q) || c.words.some((w) => w.startsWith(q)))
    .map((c) => c.currency);
};

const label = (c: ICurrency) => `${c.name} (${c.symbol})`;

/** Searchable currency picker following the WAI-ARIA combobox pattern. */
export const CurrencySelect = React.forwardRef<HTMLInputElement, ICurrencySelect>(
  ({ id, value, onChange, onBlur, invalid, describedBy, inputClassName }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [active, setActive] = React.useState(0);
    const [dropUp, setDropUp] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const listRef = React.useRef<HTMLUListElement>(null);

    const selected = CURRENCIES.find((c) => c.code === value);
    const results = React.useMemo(() => search(query), [query]);
    const listId = `${id}-listbox`;
    const optionId = (c: ICurrency) => `${id}-option-${c.code}`;

    const setRefs = (el: HTMLInputElement | null) => {
      inputRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    };

    const openList = (initialQuery = "") => {
      if (open) return;
      const input = inputRef.current;
      if (input) {
        // On phones, lift the field to the top of the screen (scroll-mt clears the
        // header) so the list has room to drop down above the keyboard.
        if (window.innerWidth < 1024) input.scrollIntoView({ block: "start", behavior: "instant" as ScrollBehavior });
        // Open upwards only when there still isn't room below.
        const rect = input.getBoundingClientRect();
        const viewport = window.visualViewport?.height ?? window.innerHeight;
        const chrome = window.innerWidth < 1024 ? 88 : 16;
        const below = viewport - rect.bottom - chrome;
        setDropUp(below < 240 && rect.top > below);
      }
      setQuery(initialQuery);
      // Start on the current selection, or on the first match when typing.
      setActive(initialQuery ? 0 : Math.max(0, CURRENCIES.findIndex((c) => c.code === value)));
      setOpen(true);
    };

    const close = () => {
      setOpen(false);
      setQuery("");
    };

    const choose = (c: ICurrency, { keepFocus }: { keepFocus: boolean }) => {
      onChange(c.code);
      close();
      // After a tap, drop focus so the phone keyboard goes away.
      if (!keepFocus) inputRef.current?.blur();
    };

    // Keep the highlighted option visible while moving through the list.
    React.useEffect(() => {
      if (!open) return;
      const el = listRef.current?.children[active] as HTMLElement | undefined;
      el?.scrollIntoView({ block: "nearest" });
    }, [active, open]);

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!open) return openList();
          setActive((i) => Math.min(i + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          if (!open) return openList();
          setActive((i) => Math.max(i - 1, 0));
          break;
        case "Home":
        case "End":
          if (!open) return;
          e.preventDefault();
          setActive(e.key === "Home" ? 0 : results.length - 1);
          break;
        case "Enter":
          // Never let Enter here submit the invoice form.
          e.preventDefault();
          if (open && results[active]) choose(results[active], { keepFocus: true });
          else openList();
          break;
        case "Escape":
          if (open) {
            e.preventDefault();
            e.stopPropagation();
            close();
          }
          break;
      }
    };

    return (
      <div className="relative">
        <input
          ref={setRefs}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && results[active] ? optionId(results[active]) : undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="done"
          className={cn(inputClassName, "pr-10 cursor-pointer", open && "cursor-text")}
          placeholder={open ? "Search name, code or symbol" : "Select currency"}
          value={open ? query : selected ? label(selected) : ""}
          onFocus={(e) => e.currentTarget.select()}
          onClick={() => openList()}
          onChange={(e) => {
            if (!open) return openList(e.target.value);
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          onBlur={() => {
            close();
            onBlur();
          }}
        />
        <ChevronDown
          aria-hidden
          strokeWidth={1.75}
          className={cn(
            "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-ink-3 transition-transform duration-200 ease-out",
            open && "rotate-180"
          )}
        />

        {open && (
          <div
            className={cn(
              "ib-pop absolute inset-x-0 z-20 rounded-xl bg-white overflow-hidden",
              "shadow-[0_0_0_1px_rgba(12,13,15,0.08),0_12px_32px_-8px_rgba(16,24,32,0.18)]",
              dropUp ? "bottom-full mb-1.5 origin-bottom" : "top-full mt-1.5 origin-top"
            )}
          >
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              aria-label="Currencies"
              className="max-h-[264px] overflow-y-auto overscroll-contain py-1.5"
            >
              {results.map((c, i) => {
                const isSelected = c.code === value;
                return (
                  <li
                    key={c.code}
                    id={optionId(c)}
                    role="option"
                    aria-selected={isSelected}
                    // Keep focus in the input so the click registers before blur closes the list.
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseMove={() => active !== i && setActive(i)}
                    onClick={() => choose(c, { keepFocus: false })}
                    className={cn(
                      "mx-1.5 flex items-center gap-3 rounded-lg px-2.5 py-2 cursor-pointer text-[15px] sm:text-[14px]",
                      i === active && "bg-black/[0.05]"
                    )}
                  >
                    <span className="flex-1 min-w-0 truncate">
                      {c.name}
                      <span className="ml-1.5 text-[12px] text-ink-4">{c.code}</span>
                    </span>
                    <span className="tnum text-[13px] text-ink-2 shrink-0">{c.symbol}</span>
                    <Check aria-hidden strokeWidth={2.25} className={cn("size-4 shrink-0 text-mint", !isSelected && "invisible")} />
                  </li>
                );
              })}
            </ul>
            {results.length === 0 && (
              <p className="px-4 py-6 text-center text-[14px] text-ink-3">No currency matches “{query.trim()}”</p>
            )}
          </div>
        )}
      </div>
    );
  }
);
CurrencySelect.displayName = "CurrencySelect";
