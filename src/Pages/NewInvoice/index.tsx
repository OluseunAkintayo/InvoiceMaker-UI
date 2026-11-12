import React from "react";
import { IInvoiceItem } from "@/lib/types";
import { AlertCircle, Calendar, Download, Eye, ImagePlus, Loader2, Plus, RotateCcw, Trash2, X } from "lucide-react";
import * as yup from 'yup';
import { FieldErrors, useController, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import useMobile from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { DEFAULT_LOGO, PDF_MARGIN_MM, PrintComponent, ScaledPaper, formatMoney, withCurrency } from "./PrintComponent";
import { findCurrency, isKnownCurrency } from "./currencies";
import { CurrencySelect } from "./CurrencySelect";
import "./builder.css";

// @ts-expect-error module_file_declaration
import html2pdf from 'html2pdf.js';

/* ---------- Shared styling ---------- */

// 16px on phones stops iOS Safari from zooming into focused inputs.
const inputCls =
  "h-10 w-full min-w-0 rounded-[10px] bg-white px-3 text-[16px] sm:text-[14px] text-ink placeholder:text-ink-4 " +
  "shadow-[inset_0_0_0_1px_rgba(12,13,15,0.14)] outline-none transition-shadow duration-150 scroll-mt-28 " +
  "focus:shadow-[inset_0_0_0_1px_#0e9f6e,0_0_0_3px_rgba(14,159,110,0.18)] " +
  "aria-[invalid=true]:shadow-[inset_0_0_0_1px_#c42b2b,0_0_0_3px_rgba(196,43,43,0.10)]";

const primaryBtn =
  "ib-press inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-ink text-white text-[15px] font-medium whitespace-nowrap " +
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.2)] hover:bg-[#25282d] disabled:opacity-60 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint/50 focus-visible:ring-offset-2";

const secondaryBtn =
  "ib-press inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full bg-white text-ink text-[15px] font-medium whitespace-nowrap " +
  "shadow-[inset_0_0_0_1px_rgba(12,13,15,0.14)] hover:bg-[#fafafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint/50";

const stagger = (i: number) => ({ animationDelay: `${i * 40}ms` });

/* ---------- Small building blocks ---------- */

interface IField {
  label: string;
  htmlFor: string;
  optional?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}
const Field = ({ label, htmlFor, optional, error, className, children }: IField) => (
  <div className={cn("flex flex-col gap-1.5 min-w-0", className)}>
    <label htmlFor={htmlFor} className="text-[12.5px] font-medium text-ink-2">
      {label}{optional && <span className="font-normal text-ink-4"> (optional)</span>}
    </label>
    {children}
    {error && (
      <p id={`${htmlFor}-error`} className="flex items-center gap-1 text-[12px] text-danger">
        <AlertCircle className="size-3.5 shrink-0" strokeWidth={2} />{error}
      </p>
    )}
  </div>
);

/**
 * Native date picker with our own placeholder and icon. iOS Safari shows nothing
 * in an empty date input, so without this the field looks missing on iPhone.
 */
const DateInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { empty: boolean }>(
  ({ empty, className, ...props }, ref) => (
    <div className="relative">
      <input ref={ref} type="date" data-empty={empty} className={cn(inputCls, "ib-date peer pr-10", className)} {...props} />
      {empty && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[16px] sm:text-[14px] text-ink-4 peer-focus:hidden">
          Select date
        </span>
      )}
      <Calendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-ink-3" strokeWidth={1.75} />
    </div>
  )
);
DateInput.displayName = "DateInput";

const Group = ({ title, aside, children, index }: { title: string; aside?: React.ReactNode; children: React.ReactNode; index: number }) => (
  // focus-within lifts this card above its neighbours so an open dropdown isn't covered by the next card.
  <section className="ib-enter relative focus-within:z-10 rounded-2xl bg-white p-5 sm:p-[22px] shadow-[inset_0_0_0_1px_rgba(12,13,15,0.08)]" style={stagger(index)}>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-[15px] font-semibold tracking-[-0.01em]">{title}</h2>
      {aside && <span className="text-[12px] text-ink-3">{aside}</span>}
    </div>
    {children}
  </section>
);

/** Required fields in on-screen order, so focus lands on the first visible problem. */
const FIELD_ORDER = [
  "biller_name", "biller_email", "biller_address",
  "customer_name", "customer_email", "customer_address",
  "invoice_number", "bill_date", "due_date", "currency",
  "tax", "discount",
] as const;

/** sessionStorage keys that make up the saved draft. */
const DRAFT_KEYS = [
  "invoiceItems", "invoice_number", "currency", "notes", "bill_date", "due_date",
  "biller_name", "biller_address", "biller_email",
  "customer_name", "customer_address", "customer_email",
];

const NewInvoice = () => {
  const mobile = useMobile();
  const { toast, dismiss } = useToast();
  const [invoiceItems, setInvoiceItems] = React.useState<Array<IInvoiceItem>>(JSON.parse(sessionStorage.getItem("invoiceItems") ?? 'null') ?? []);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [previewOpen, setPreviewOpen] = React.useState(false);

  React.useEffect(() => {
    if (JSON.parse(sessionStorage.getItem("invoiceItems") ?? 'null') === null) {
      if (mobile) {
        setInvoiceItems([{ description: "", rate: "", quantity: "" }]);
        return;
      }
      setInvoiceItems([{ description: "", rate: "1", quantity: "1" }])
    }
  }, [mobile]);

  const saveItems = (items: Array<IInvoiceItem>) => sessionStorage.setItem("invoiceItems", JSON.stringify(items));

  const handleChange = (i: number, field: string, value: string | number) => {
    const newItems = [...invoiceItems]
    newItems[i] = { ...newItems[i], [field]: value }
    setInvoiceItems(newItems);
  }

  const schema = yup.object().shape({
    logo: yup.string(),
    invoice_number: yup.string().required("Enter an invoice number"),
    biller_name: yup.string().required("Enter your business name"),
    biller_address: yup.string().required("Enter your business address"),
    biller_email: yup.string().required("Enter your email"),
    customer_name: yup.string().required("Enter your client's name"),
    customer_address: yup.string(),
    customer_email: yup.string().email("Enter a valid email address"),
    bill_date: yup.date().typeError("Pick an issue date").required("Required"),
    due_date: yup.date().typeError("Pick a due date").required("Required"),
    tax: yup.number().typeError("Enter a number").required("Tax field is required"),
    shipping: yup.number().typeError("Entry must be a number"),
    // Optional: an empty discount counts as 0. Text that isn't a number still errors.
    discount: yup.number()
      .transform((value, original) => (original === "" || original == null ? 0 : value))
      .typeError("Enter a number")
      .default(0),
    amount_paid: yup.number().typeError("Entry must be a number"),
    due_balance: yup.number().typeError("Entry must be a number"),
    currency: yup.string().required("Select a currency"),
    notes: yup.string(),
    terms: yup.string()
  })
  const form = useForm({ resolver: yupResolver(schema) });
  const { handleSubmit, register, reset, setValue, setFocus, watch, formState: { errors: formErrors } } = form;
  // The currency picker is a custom combobox, so it's connected as a controlled field.
  const { field: currencyField } = useController({ name: "currency", control: form.control });
  const [loading, setLoading] = React.useState<boolean>(false);

  const submit = async () => {
    setLoading(true);
    try {
      const elem = document.getElementById("invoice");
      await html2pdf()
        .set({
          filename: 'Invoice ' + watch().invoice_number,
          margin: [PDF_MARGIN_MM, 0, PDF_MARGIN_MM, 0],
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          // When items overflow onto more pages, never cut a row or the totals in half.
          pagebreak: { mode: ['css'], avoid: ['tr', '.ib-keep'] },
        })
        .from(elem)
        .save();
      // Only clear the form once the PDF has actually been generated.
      resetBuilder();
      toast({
        className: 'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
        title: "Invoice downloaded",
        description: "The form has been cleared for your next invoice.",
      });
    } catch {
      toast({
        variant: "destructive",
        className: 'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
        title: "Couldn't create the PDF",
        description: "Your details are still here. Try downloading again.",
      });
    } finally {
      setLoading(false);
    }
  }

  /** Clears every field and the saved draft, then starts a fresh invoice. */
  const resetBuilder = () => {
    DRAFT_KEYS.forEach((key) => sessionStorage.removeItem(key));
    reset({
      logo: DEFAULT_LOGO,
      invoice_number: "",
      biller_name: "",
      biller_address: "",
      biller_email: "",
      customer_name: "",
      customer_address: "",
      customer_email: "",
      bill_date: "" as unknown as Date,
      due_date: "" as unknown as Date,
      currency: "",
      tax: 7.5,
      discount: 0,
      notes: "",
    });
    generateinvoice_number();
    const fresh = [newItem()];
    setInvoiceItems(fresh);
    saveItems(fresh);
    setActiveIndex(null);
    setPreviewOpen(false);
    window.scrollTo({ top: 0 });
  }

  const invalidHandler = (action: "download" | "preview") => (errors: FieldErrors) => {
    const count = Object.keys(errors).length;
    const first = FIELD_ORDER.find((name) => errors[name]);
    const wasOpen = previewOpen;
    if (wasOpen) setPreviewOpen(false);
    toast({
      className: 'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
      title: count === 1 ? "One field needs attention" : `${count} fields need attention`,
      description: action === "preview"
        ? "Complete the highlighted fields to preview your invoice."
        : "Fix the highlighted fields, then download again.",
    });
    // Wait for the sheet to finish closing so focus isn't trapped inside it.
    if (first) setTimeout(() => setFocus(first), wasOpen ? 260 : 0);
  }

  const download = handleSubmit(submit, invalidHandler("download"));
  // Mobile preview only opens once the required fields pass validation.
  const openPreview = handleSubmit(() => {
    dismiss(); // clear any stale "fields need attention" toast
    setPreviewOpen(true);
  }, invalidHandler("preview"));

  const newItem = (): IInvoiceItem => mobile ? { description: "", rate: "", quantity: "" } : { description: "", rate: "1", quantity: "1" };

  const addItem = () => {
    const next = [...invoiceItems, newItem()];
    setInvoiceItems(next);
    saveItems(next);
  }

  const removeItem = (idx: number) => {
    const filtered = invoiceItems.filter((_, i) => i !== idx);
    setInvoiceItems(filtered);
    saveItems(filtered);
  }

  // invoice total
  const [total, setTotal] = React.useState<number>(0);
  React.useEffect(() => {
    const sum = invoiceItems.reduce((acc, item) => acc + (Number(item.rate) * Number(item.quantity)), 0);
    setTotal(sum);
  }, [invoiceItems]);

  const generateinvoice_number = () => {
    const num = Math.floor(10000000 + Math.random() * 99999999);
    setValue("invoice_number", "#" + num.toString(), { shouldValidate: !!formErrors.invoice_number });
    sessionStorage.setItem("invoice_number", watch("invoice_number"));
  }

  React.useEffect(() => {
    const invoice_number = sessionStorage.getItem("invoice_number");
    if (invoice_number) {
      setValue("invoice_number", invoice_number);
    } else {
      generateinvoice_number();
    }

    setValue("logo", DEFAULT_LOGO);
    setValue("discount", 0);
    setValue("tax", 7.5);
    // The draft stores an ISO code. Older drafts held free text or a symbol; those start empty.
    const savedCurrency = sessionStorage.getItem("currency");
    setValue("currency", isKnownCurrency(savedCurrency) ? savedCurrency : '');
    setValue("biller_name", sessionStorage.getItem("biller_name") || '');
    setValue("biller_address", sessionStorage.getItem("biller_address") || '');
    setValue("biller_email", sessionStorage.getItem("biller_email") || '');
    setValue("customer_name", sessionStorage.getItem("customer_name") || '');
    setValue("customer_address", sessionStorage.getItem("customer_address") || '');
    setValue("customer_email", sessionStorage.getItem("customer_email") || '');
    setValue("notes", sessionStorage.getItem("notes") || '');
    const billDate = sessionStorage.getItem("bill_date");
    const dueDate = sessionStorage.getItem("due_date");
    // Dates are kept as the input's "YYYY-MM-DD" string; yup casts them on submit.
    if (billDate) setValue("bill_date", billDate as unknown as Date);
    if (dueDate) setValue("due_date", dueDate as unknown as Date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // allow choosing the same file again later
    if (!file) return; // picker was cancelled: keep the current logo
    if (/\.(jpe?g|png|webp)$/i.test(file.name)) {
      setValue("logo", URL.createObjectURL(file));
      return;
    }
    toast({
      variant: "destructive",
      className: 'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
      title: "That image format isn't supported",
      description: "Use a PNG, JPG or WebP file.",
    });
  }

  React.useEffect(() => { window.scrollTo(0, 0) }, []);

  // The sheet is a phone/tablet surface; close it if the window grows to desktop.
  React.useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = () => { if (mql.matches) setPreviewOpen(false); };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  /** register() plus saving to sessionStorage on blur, and aria wiring for errors. */
  const persisted = (name: Parameters<typeof register>[0], saveOnChange = false) => {
    const save = (e: { target: { value: string } }) => sessionStorage.setItem(name, e.target.value);
    return {
      id: name,
      "aria-invalid": formErrors[name] ? true : undefined,
      "aria-describedby": formErrors[name] ? `${name}-error` : undefined,
      ...register(name, { onBlur: save, ...(saveOnChange && { onChange: save }) }),
    };
  };

  const values = watch();
  const logo = values.logo;
  const hasLogo = !!logo && logo !== DEFAULT_LOGO;
  const taxPct = Number(values.tax) || 0;
  const discount = Number(values.discount) || 0;
  const grandTotal = total * (1 + taxPct / 100) - discount;
  const errorCount = Object.keys(formErrors).length;
  // Live count of fields that would fail validation, for the mobile Preview button.
  const fieldsLeft = (() => {
    try {
      schema.validateSync(values, { abortEarly: false });
      return 0;
    } catch (e) {
      return e instanceof yup.ValidationError ? new Set(e.inner.map((err) => err.path)).size || 1 : 0;
    }
  })();
  const readyToPreview = fieldsLeft === 0;

  const paper = (
    <PrintComponent invoiceFields={values} total={total} invoiceItems={invoiceItems} showPlaceholders activeIndex={activeIndex} />
  );

  return (
    <>
      <form noValidate autoComplete="off" onSubmit={download}>
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 pt-8 pb-32 lg:pb-20 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] items-start">

          {/* ---------- Form ---------- */}
          <div className="min-w-0">
            <div className="ib-enter">
              <h1 className="text-[30px] sm:text-[34px] leading-[1.1] tracking-[-0.03em] font-semibold">New invoice</h1>
              <p className="text-[15px] text-ink-2 mt-2 max-w-[48ch]">
                Fill in the details and your invoice builds itself. Preview it, then download a PDF.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 mt-7">
              <Group title="From" aside="Your business" index={1}>
                <div className="grid gap-4 sm:grid-cols-[96px_minmax(0,1fr)]">
                  <div className="relative size-24">
                    <label
                      htmlFor="logo"
                      className={cn(
                        "ib-press grid place-items-center size-24 rounded-[14px] cursor-pointer overflow-hidden",
                        hasLogo
                          ? "bg-white shadow-[inset_0_0_0_1px_rgba(12,13,15,0.14)]"
                          : "border-[1.5px] border-dashed border-black/[0.16] text-ink-3 hover:border-mint hover:bg-mint-soft hover:text-mint-ink"
                      )}
                    >
                      {hasLogo
                        ? <img src={logo} alt="Your logo" className="size-full object-contain p-2" />
                        : <span className="flex flex-col items-center gap-1.5 text-[11.5px] font-medium"><ImagePlus className="size-5" strokeWidth={1.75} />Add logo</span>}
                      <span className="sr-only">{hasLogo ? "Change logo" : "Upload a logo"}</span>
                    </label>
                    <input type="file" id="logo" accept=".png,.jpg,.jpeg,.webp" className="sr-only" onChange={handleImageUpload} />
                    {hasLogo && (
                      <button
                        type="button"
                        onClick={() => setValue("logo", DEFAULT_LOGO)}
                        aria-label="Remove logo"
                        className="ib-press absolute -top-2 -right-2 grid place-items-center size-6 rounded-full bg-ink text-white shadow-md"
                      >
                        <X className="size-3.5" strokeWidth={2.25} />
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <Field label="Business name" htmlFor="biller_name" error={formErrors.biller_name?.message} className="sm:col-span-2">
                      <input className={inputCls} placeholder="Northwind Studio" {...persisted("biller_name")} />
                    </Field>
                    <Field label="Email" htmlFor="biller_email" error={formErrors.biller_email?.message}>
                      <input className={inputCls} type="email" inputMode="email" placeholder="you@business.com" {...persisted("biller_email")} />
                    </Field>
                    <Field label="Address" htmlFor="biller_address" error={formErrors.biller_address?.message}>
                      <input className={inputCls} placeholder="Street, city" {...persisted("biller_address")} />
                    </Field>
                  </div>
                </div>
              </Group>

              <Group title="Bill to" aside="Your client" index={2}>
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <Field label="Client name" htmlFor="customer_name" error={formErrors.customer_name?.message} className="sm:col-span-2">
                    <input className={inputCls} placeholder="Client or company name" {...persisted("customer_name")} />
                  </Field>
                  <Field label="Email" htmlFor="customer_email" optional error={formErrors.customer_email?.message}>
                    <input className={inputCls} type="email" inputMode="email" placeholder="client@company.com" {...persisted("customer_email")} />
                  </Field>
                  <Field label="Address" htmlFor="customer_address" optional error={formErrors.customer_address?.message}>
                    <input className={inputCls} placeholder="Street, city" {...persisted("customer_address")} />
                  </Field>
                </div>
              </Group>

              <Group title="Details" index={3}>
                <div className="grid gap-3.5 grid-cols-2 sm:grid-cols-[1.2fr_1fr_1fr]">
                  <Field label="Invoice number" htmlFor="invoice_number" error={formErrors.invoice_number?.message} className="col-span-2 sm:col-span-1">
                    <div className="relative">
                      <input className={cn(inputCls, "tnum pr-11")} {...persisted("invoice_number")} />
                      <button
                        type="button"
                        onClick={generateinvoice_number}
                        aria-label="Generate a new invoice number"
                        title="Generate a new number"
                        className="ib-press absolute right-1.5 top-1/2 -translate-y-1/2 grid place-items-center size-7 rounded-lg text-ink-3 hover:bg-black/[0.05] hover:text-ink"
                      >
                        <RotateCcw className="size-4" strokeWidth={1.75} />
                      </button>
                    </div>
                  </Field>
                  <Field label="Issue date" htmlFor="bill_date" error={formErrors.bill_date?.message}>
                    <DateInput empty={!values.bill_date} {...persisted("bill_date")} />
                  </Field>
                  <Field label="Due date" htmlFor="due_date" error={formErrors.due_date?.message}>
                    <DateInput empty={!values.due_date} {...persisted("due_date")} />
                  </Field>
                  <Field label="Currency" htmlFor="currency" error={formErrors.currency?.message} className="col-span-2">
                    <CurrencySelect
                      ref={currencyField.ref}
                      id="currency"
                      value={currencyField.value ?? ""}
                      onChange={(code) => {
                        currencyField.onChange(code);
                        sessionStorage.setItem("currency", code);
                      }}
                      onBlur={currencyField.onBlur}
                      invalid={!!formErrors.currency}
                      describedBy={formErrors.currency ? "currency-error" : undefined}
                      inputClassName={inputCls}
                    />
                  </Field>
                </div>
              </Group>

              <Group title="Items" aside={invoiceItems.length === 1 ? "1 item" : `${invoiceItems.length} items`} index={4}>
                <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_72px_112px_112px_32px] gap-2 pb-2 text-[12px] text-ink-3">
                  <span>Description</span><span className="text-right">Qty</span><span className="text-right">Rate</span><span className="text-right">Amount</span><span />
                </div>

                {invoiceItems.length === 0 && (
                  <p className="py-6 text-center text-[14px] text-ink-3 border-t border-black/[0.08]">No items yet. Add your first one below.</p>
                )}

                <div className="divide-y divide-black/[0.06] sm:divide-y-0">
                  {invoiceItems.map((item, index) => {
                    const focusProps = {
                      onFocus: () => setActiveIndex(index),
                      onBlur: () => { setActiveIndex(null); saveItems(invoiceItems); },
                    };
                    return (
                      <div key={index} className="grid grid-cols-[1fr_1fr_1fr_32px] sm:grid-cols-[minmax(0,1fr)_72px_112px_112px_32px] gap-2 items-end sm:items-center py-3 sm:py-1.5 first:pt-0 sm:first:pt-1.5">
                        <div className="col-span-4 sm:col-span-1 flex flex-col gap-1">
                          <label htmlFor={`item-${index}-description`} className="text-[11.5px] text-ink-3 sm:sr-only">Description</label>
                          <input
                            id={`item-${index}-description`}
                            className={cn(inputCls, "sm:h-[38px]")}
                            value={item.description}
                            placeholder="What did you do?"
                            onChange={(e) => handleChange(index, "description", e.target.value)}
                            {...focusProps}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label htmlFor={`item-${index}-quantity`} className="text-[11.5px] text-ink-3 sm:sr-only">Qty</label>
                          <input
                            id={`item-${index}-quantity`}
                            className={cn(inputCls, "tnum text-right sm:h-[38px]")}
                            value={item.quantity}
                            inputMode="numeric"
                            placeholder="1"
                            onChange={(e) => { if (/^-?\d*$/.test(e.target.value)) handleChange(index, "quantity", e.target.value); }}
                            {...focusProps}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label htmlFor={`item-${index}-rate`} className="text-[11.5px] text-ink-3 sm:sr-only">Rate</label>
                          <input
                            id={`item-${index}-rate`}
                            className={cn(inputCls, "tnum text-right sm:h-[38px]")}
                            value={item.rate}
                            inputMode="decimal"
                            placeholder="0.00"
                            onChange={(e) => { if (/^-?\d*\.?\d*$/.test(e.target.value)) handleChange(index, "rate", e.target.value); }}
                            {...focusProps}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[11.5px] text-ink-3 text-right sm:sr-only">Amount</span>
                          <span className="tnum h-10 sm:h-auto flex items-center justify-end text-[14px] font-medium">
                            {formatMoney(Number(item.quantity) * Number(item.rate))}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          aria-label={`Remove ${item.description || `item ${index + 1}`}`}
                          className="ib-press grid place-items-center size-8 mb-1 sm:mb-0 rounded-lg text-ink-4 hover:text-danger hover:bg-danger/[0.06]"
                        >
                          <Trash2 className="size-4" strokeWidth={1.75} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={addItem}
                  className="ib-press mt-2.5 w-full h-11 rounded-[10px] border-[1.5px] border-dashed border-black/[0.16] flex items-center justify-center gap-1.5 text-[14px] font-medium text-ink-2 hover:border-ink-3 hover:text-ink"
                >
                  <Plus className="size-4" strokeWidth={2} />Add item
                </button>

                <div className="grid grid-cols-2 gap-3.5 mt-5 pt-5 border-t border-black/[0.08]">
                  <Field label="Tax" htmlFor="tax" error={formErrors.tax?.message}>
                    <div className="relative">
                      <input className={cn(inputCls, "tnum pr-9")} inputMode="decimal" {...persisted("tax")} />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-ink-3">%</span>
                    </div>
                  </Field>
                  <Field label="Discount" htmlFor="discount" error={formErrors.discount?.message}>
                    <div className="relative">
                      <input className={cn(inputCls, "tnum pr-14")} inputMode="decimal" {...persisted("discount")} />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-ink-3">{findCurrency(values.currency)?.symbol ?? ""}</span>
                    </div>
                  </Field>
                </div>
              </Group>

              <Group title="Notes" aside="Optional" index={5}>
                <label htmlFor="notes" className="sr-only">Notes</label>
                <textarea
                  className={cn(inputCls, "h-auto min-h-[96px] py-2.5 leading-[1.5] resize-y")}
                  placeholder="Payment details, thank-you note, terms…"
                  {...persisted("notes")}
                />
              </Group>
            </div>
          </div>

          {/* ---------- Live preview (desktop) ---------- */}
          <aside className="hidden lg:flex flex-col sticky top-[88px] h-[calc(100dvh-112px)] ib-enter" style={stagger(3)}>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-[15px] font-semibold tracking-[-0.01em]">Preview</h2>
              <span className="text-[12.5px] text-ink-3">Updates as you type</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto -mx-3 px-3 pt-1 pb-6 [scrollbar-width:thin]">
              <ScaledPaper className="rounded-xl overflow-hidden shadow-[0_1px_1px_rgba(16,24,32,0.04),0_12px_32px_-12px_rgba(16,24,32,0.14),0_0_0_1px_rgba(12,13,15,0.06)]">
                {paper}
              </ScaledPaper>
            </div>
            <div className="pt-4 border-t border-black/[0.06]">
              <button type="submit" className={cn(primaryBtn, "w-full")} disabled={loading}>
                {loading ? <><Loader2 className="size-4 animate-spin" />Preparing PDF…</> : <><Download className="size-4" strokeWidth={2} />Download PDF</>}
              </button>
              {errorCount > 0 && (
                <p className="mt-2.5 text-center text-[12.5px] text-danger">
                  Fix {errorCount === 1 ? "1 field" : `${errorCount} fields`} before downloading
                </p>
              )}
            </div>
          </aside>
        </div>
      </form>

      {/* ---------- Bottom bar (phones and tablets) ---------- */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 ib-glass shadow-[0_-1px_0_rgba(12,13,15,0.08)] pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-[1360px] h-[72px] px-4 sm:px-6 flex items-center gap-4">
          <div className="min-w-0">
            {/* <p className="text-[12px] text-ink-3" aria-live="polite">
              {readyToPreview ? "Total" : `${fieldsLeft} required ${fieldsLeft === 1 ? "field" : "fields"} left`}
            </p> */}
            <p className="tnum text-[17px] font-semibold truncate">
              {withCurrency(values.currency, grandTotal)}
            </p>
          </div>
          {/* Looks inactive until the form is complete, but stays tappable: a tap shows what's missing. */}
          <button
            type="button"
            onClick={openPreview}
            aria-disabled={!readyToPreview}
            className={cn(
              "ml-auto",
              readyToPreview ? primaryBtn : cn(secondaryBtn, "text-ink-3")
            )}
          >
            <Eye className="size-4" strokeWidth={2} />Preview
          </button>
        </div>
      </div>

      {/* ---------- Preview sheet (phones and tablets) ---------- */}
      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent
          side="bottom"
          aria-describedby={undefined}
          hideClose
          // While the PDF is being made, a stray tap outside or Escape must not dismiss the sheet.
          // Closing on purpose stays possible through the close and Edit buttons.
          onInteractOutside={(e) => { if (loading) e.preventDefault(); }}
          onEscapeKeyDown={(e) => { if (loading) e.preventDefault(); }}
          className="ib ib-sheet lg:hidden h-[92dvh] p-0 gap-0 flex flex-col border-0 rounded-t-[20px] bg-canvas data-[state=open]:duration-300 data-[state=closed]:duration-200"
        >
          <div className="flex items-start gap-4 px-5 pt-5 pb-3">
            <div className="min-w-0">
              <SheetTitle className="text-[17px] font-semibold tracking-[-0.01em] text-ink">Preview</SheetTitle>
              <p className="text-[13px] text-ink-3 mt-0.5">
                {loading ? "Preparing your PDF…" : "Check it over, then download."}
              </p>
            </div>
            <SheetClose asChild>
              <button
                type="button"
                aria-label="Close preview"
                className="ib-press ml-auto -mr-1 grid place-items-center size-9 shrink-0 rounded-full bg-black/[0.06] text-ink-2 hover:bg-black/[0.1] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint/50"
              >
                <X className="size-[18px]" strokeWidth={2} />
              </button>
            </SheetClose>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 overscroll-contain">
            <ScaledPaper className="rounded-lg overflow-hidden shadow-[0_1px_1px_rgba(16,24,32,0.04),0_8px_24px_-12px_rgba(16,24,32,0.18),0_0_0_1px_rgba(12,13,15,0.06)]">
              {paper}
            </ScaledPaper>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-3 px-4 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] shadow-[0_-1px_0_rgba(12,13,15,0.08)] bg-canvas">
            <SheetClose asChild>
              <button type="button" className={secondaryBtn}>Edit</button>
            </SheetClose>
            <button type="button" onClick={download} className={primaryBtn} disabled={loading}>
              {loading ? <><Loader2 className="size-4 animate-spin" />Preparing PDF…</> : <><Download className="size-4" strokeWidth={2} />Download PDF</>}
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Full-size copy that html2pdf renders from. */}
      <div className="hidden">
        <PrintComponent id="invoice" forPdf invoiceFields={values} total={total} invoiceItems={invoiceItems} />
      </div>
    </>
  )
}

export default NewInvoice;
