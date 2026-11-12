import React from "react";
import { IInvoiceFields, IInvoiceItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { findCurrency } from "./currencies";

/** A4 at 96dpi. The paper is always laid out at this size, then scaled to fit. */
export const PAPER_WIDTH = 794;
/**
 * A4 is 794 × 1122.9px. html2pdf rounds a page down to 1122px, so anything
 * taller spills a sliver onto a blank second page. Stay safely under it.
 */
export const PAPER_MIN_HEIGHT = 1120;

/**
 * The PDF gets a 12mm top/bottom page margin so overflow pages don't start at
 * the paper's edge. That leaves 273mm ≈ 1032px of content height per page, so
 * the print copy uses less vertical padding and a slightly shorter minimum.
 */
export const PDF_MARGIN_MM = 12;
const PRINT_MIN_HEIGHT = 1028;
export const DEFAULT_LOGO = "/assets/200x144.svg";

export const formatMoney = (n: number) =>
  (Number.isFinite(n) ? n : 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Formats an amount with the symbol for an ISO currency code:
 * "$1,200.00", "₦1,200.00", but "KSh 1,200.00" and "Fr. 1,200.00": symbols ending in
 * a letter or a full stop get a space.
 */
export const withCurrency = (code: string | undefined, n: number) => {
  const symbol = findCurrency(code)?.symbol;
  if (!symbol) return formatMoney(n);
  return `${symbol}${/[\p{L}.]$/u.test(symbol) ? " " : ""}${formatMoney(n)}`;
};

/** <input type="date"> gives "YYYY-MM-DD"; parse it as a local date so it doesn't shift a day. */
const formatDate = (value: unknown) => {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  const date = new Date(value as string);
  return isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

interface IPrintComponent {
  total: number;
  invoiceItems: Array<IInvoiceItem>;
  invoiceFields: IInvoiceFields;
  id?: string;
  /** On-screen preview shows hints for empty fields; the PDF never does. */
  showPlaceholders?: boolean;
  /** Index of the item currently being edited, highlighted on screen. */
  activeIndex?: number | null;
  /** Layout for html2pdf (the PDF's page margin supplies the top/bottom space). */
  forPdf?: boolean;
}

export const PrintComponent = ({ invoiceFields, total, invoiceItems, id, showPlaceholders = false, activeIndex = null, forPdf = false }: IPrintComponent) => {
  const tax = Number(invoiceFields.tax) || 0;
  const discount = Number(invoiceFields.discount) || 0;
  const grandTotal = total * (1 + tax / 100) - discount;
  const hasLogo = !!invoiceFields.logo && invoiceFields.logo !== DEFAULT_LOGO;
  const issued = formatDate(invoiceFields.bill_date);
  const due = formatDate(invoiceFields.due_date);

  const Hint = ({ children }: { children: React.ReactNode }) =>
    showPlaceholders ? <span className="text-ink-4">{children}</span> : null;

  return (
    <div
      id={id}
      className="ib bg-white text-ink flex flex-col"
      style={forPdf
        ? { width: PAPER_WIDTH, minHeight: PRINT_MIN_HEIGHT, padding: "12px 56px" }
        : { width: PAPER_WIDTH, minHeight: PAPER_MIN_HEIGHT, padding: 56 }}
    >
      <div className="flex items-start justify-between gap-8">
        <div>
          <h1 className="text-[40px] leading-none font-semibold tracking-[-0.03em]">Invoice</h1>
          <p className="tnum text-[14px] text-ink-3 mt-3">{invoiceFields.invoice_number || <Hint>No number</Hint>}</p>
        </div>
        {hasLogo && <img src={invoiceFields.logo} alt="" className="max-h-[72px] max-w-[160px] object-contain rounded-lg" />}
      </div>

      <div className="grid grid-cols-3 gap-8 mt-12 py-6 border-y border-black/[0.08] text-[14px] leading-[1.6]">
        <div className="min-w-0">
          <span className="block text-[12px] text-ink-3 mb-1">From</span>
          <p className="font-semibold break-words">{invoiceFields.biller_name || <Hint>Your business</Hint>}</p>
          <p className="text-ink-2 break-words">{invoiceFields.biller_address}</p>
          <p className="text-ink-2 break-words">{invoiceFields.biller_email}</p>
        </div>
        <div className="min-w-0">
          <span className="block text-[12px] text-ink-3 mb-1">Bill to</span>
          <p className="font-semibold break-words">{invoiceFields.customer_name || <Hint>Client name</Hint>}</p>
          <p className="text-ink-2 break-words">{invoiceFields.customer_address}</p>
          <p className="text-ink-2 break-words">{invoiceFields.customer_email}</p>
        </div>
        <div>
          <span className="block text-[12px] text-ink-3 mb-1">Issued</span>
          <p>{issued || <Hint>Not set</Hint>}</p>
          <span className="block text-[12px] text-ink-3 mb-1 mt-3">Due</span>
          <p>{due || <Hint>Not set</Hint>}</p>
        </div>
      </div>

      <table className="w-full border-collapse text-[14px] mt-4">
        <thead>
          <tr className="text-[12px] text-ink-3">
            <th className="text-left font-medium py-3">Description</th>
            <th className="text-right font-medium py-3 w-[72px]">Qty</th>
            <th className="text-right font-medium py-3 w-[120px]">Rate</th>
            <th className="text-right font-medium py-3 w-[130px]">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItems.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 border-t border-black/[0.08] text-center">
                <Hint>No items yet</Hint>
              </td>
            </tr>
          )}
          {invoiceItems.map((item, index) => (
            <tr key={index} className={cn(showPlaceholders && activeIndex === index && "bg-mint-soft")}>
              <td className="py-3 pr-4 border-t border-black/[0.08] break-words">
                {item.description || <Hint>Untitled item</Hint>}
              </td>
              <td className="tnum py-3 text-right border-t border-black/[0.08]">{item.quantity}</td>
              <td className="tnum py-3 text-right border-t border-black/[0.08]">{formatMoney(Number(item.rate))}</td>
              <td className="tnum py-3 text-right border-t border-black/[0.08]">{formatMoney(Number(item.quantity) * Number(item.rate))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ib-keep grid grid-cols-2 gap-12 mt-auto pt-10">
        <div className="min-w-0">
          {(invoiceFields.notes || showPlaceholders) && (
            <>
              <span className="block text-[12px] text-ink-3 mb-1">Notes</span>
              <p className="text-[13px] text-ink-2 whitespace-pre-wrap break-words">{invoiceFields.notes || <Hint>No notes</Hint>}</p>
            </>
          )}
        </div>
        <div className="text-[14px]">
          <div className="flex justify-between py-1 text-ink-2"><span>Subtotal</span><span className="tnum">{formatMoney(total)}</span></div>
          <div className="flex justify-between py-1 text-ink-2"><span>Tax ({tax}%)</span><span className="tnum">{formatMoney(total * tax / 100)}</span></div>
          <div className="flex justify-between py-1 text-ink-2"><span>Discount</span><span className="tnum">{formatMoney(discount)}</span></div>
          <div className="flex justify-between items-baseline gap-4 mt-3 pt-4 border-t border-black/[0.14]">
            <span className="font-semibold">Total</span>
            <span className="text-[24px] font-semibold tracking-[-0.02em] text-right">
              {withCurrency(invoiceFields.currency, grandTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Lays the paper out at A4 width and scales it down to whatever width its container has. */
export const ScaledPaper = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const outer = React.useRef<HTMLDivElement>(null);
  const inner = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);
  const [height, setHeight] = React.useState<number>(PAPER_MIN_HEIGHT);

  React.useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const measure = () => {
      const s = Math.min(1, o.clientWidth / PAPER_WIDTH);
      setScale(s);
      setHeight(i.offsetHeight * s);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outer} className={cn("relative w-full", className)} style={{ height }}>
      <div
        ref={inner}
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: PAPER_WIDTH, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
};
