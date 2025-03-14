import React from "react";
import { Input } from "@/components/ui/input";
import { IInvoiceItem, IInvoiceFields } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FileText, Loader, OctagonAlert, RotateCcw, Trash, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import useMobile from "@/hooks/use-mobile";
import { PrintComponent } from "./PrintComponent";

// @ts-expect-error module_file_declaration
import html2pdf from 'html2pdf.js';

const NewInvoice = () => {
  const mobile = useMobile();
  const [invoiceItems, setInvoiceItems] = React.useState<Array<IInvoiceItem>>(JSON.parse(sessionStorage.getItem("invoiceItems") ?? 'null') ?? []);

  React.useEffect(() => {
    if (JSON.parse(sessionStorage.getItem("invoiceItems") ?? 'null') === null) {
      if (mobile) {
        setInvoiceItems([{ description: "", rate: "", quantity: "" }]);
        return;
      }
      setInvoiceItems([{ description: "", rate: "1", quantity: "1" }])
    }
  }, [mobile]);

  const handleChange = (i: number, field: string, value: string | number) => {
    const newItems = [...invoiceItems]
    newItems[i] = { ...newItems[i], [field]: value }
    setInvoiceItems(newItems);
  }

  const schema = yup.object().shape({
    logo: yup.string(),
    invoice_number: yup.string().required("Invoice number is required"),
    biller_name: yup.string().required("Biller name is required"),
    biller_address: yup.string().required("Biller address is required"),
    biller_email: yup.string().required("Biller email is required"),
    customer_name: yup.string().required("Client name is required"),
    customer_address: yup.string(),
    customer_email: yup.string().email("Invalid email input"),
    bill_date: yup.date().typeError("Invalid date").required("Required"),
    due_date: yup.date().typeError("Invalid date").required("Required"),
    tax: yup.number().typeError("Entry must be a number").required("Tax field is required"),
    shipping: yup.number().typeError("Entry must be a number"),
    discount: yup.number().typeError("Entry must be a number").required("Required"),
    amount_paid: yup.number().typeError("Entry must be a number"),
    due_balance: yup.number().typeError("Entry must be a number"),
    currency: yup.string().required("Currency is required"),
    notes: yup.string(),
    terms: yup.string()
  })
  const form = useForm({ resolver: yupResolver(schema) });
  const { handleSubmit, register, setValue, watch, formState: { errors: formErrors } } = form;
  const [loading, setLoading] = React.useState<boolean>(false);

  const submit: SubmitHandler<IInvoiceFields> = async () => {
    setLoading(true);
    const elem = document.getElementById("invoice");
    setTimeout(() => {
      html2pdf(elem, {
        filename: 'Invoice ' + watch().invoice_number,
      });
      setLoading(false);
    }, 2000);
  }

  const addItem = () => {
    if (invoiceItems.length === 0) {
      if (mobile) {
        setInvoiceItems([...invoiceItems, { description: "", rate: "", quantity: "" }]);
      } else {
        setInvoiceItems([...invoiceItems, { description: "", rate: "1", quantity: "1" }]);
      }
    }
    if (mobile) {
      setInvoiceItems([...invoiceItems, { description: "", rate: "", quantity: "" }]);
    } else {
      setInvoiceItems([...invoiceItems, { description: "", rate: "1", quantity: "1" }]);
    }
  }

  const removeItem = (idx: number) => {
    const filtered = invoiceItems.filter((_, i) => i !== idx);
    setInvoiceItems(filtered);
    sessionStorage.setItem("invoiceItems", JSON.stringify(filtered));
  }

  // invoice total
  const [total, setTotal] = React.useState<number>(0);
  React.useEffect(() => {
    const sum = invoiceItems.reduce((acc, item) => acc + (Number(item.rate) * Number(item.quantity)), 0);
    setTotal(sum);
  }, [invoiceItems]);

  const generateinvoice_number = () => {
    const num = Math.floor(10000000 + Math.random() * 99999999);
    setValue("invoice_number", "#" + num.toString());
    sessionStorage.setItem("invoice_number", watch("invoice_number"));
  }

  React.useEffect(() => {
    const invoice_number = sessionStorage.getItem("invoice_number");
    if (invoice_number) {
      setValue("invoice_number", invoice_number);
    } else {
      generateinvoice_number();
    }

    setValue("logo", "/assets/200x144.svg");
    setValue("discount", 0);
    setValue("tax", 7.5);
    setValue("currency", sessionStorage.getItem("currency") || '');
    setValue("biller_name", sessionStorage.getItem("biller_name") || '');
    setValue("biller_address", sessionStorage.getItem("biller_address") || '');
    setValue("biller_email", sessionStorage.getItem("biller_email") || '');
    setValue("customer_name", sessionStorage.getItem("customer_name") || '');
    setValue("customer_address", sessionStorage.getItem("customer_address") || '');
    setValue("customer_email", sessionStorage.getItem("customer_email") || '');
    setValue("notes", sessionStorage.getItem("notes") || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.name.endsWith(".jpeg") || file.name.endsWith(".jpg") || file.name.endsWith(".png") || file.name.endsWith(".webp")) {
        setValue("logo", URL.createObjectURL(file));
        return;
      }
      alert("Image format not supported");
      setValue("logo", "/assets/200x144.svg");
    }
  }

  React.useEffect(() => { window.scrollTo(0, 0) }, []);


  return (
    <section>
      <form autoComplete="off" onSubmit={handleSubmit(submit)}>
        <div className="container px-4 py-8">
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-4 justify-between">
            <div className="space-y-0">
              <h3 className="text-5xl font-semibold mb-8">Invoice</h3>
              {!mobile &&
                <div className="relative">
                  <Input className="text-xs tracking-wide" {...register("invoice_number", { onBlur: e => sessionStorage.setItem("invoice_number", e.target.value) })} />
                  <Button onClick={generateinvoice_number} type="button" className="p-0 h-8 w-8 absolute top-1 bottom-1 right-1 aspect-square rounded-full bg-slate-200 hover:bg-slate-200/80"><RotateCcw className="text-slate-700 scale-90" /></Button>
                </div>
              }
            </div>
            <div className="grid gap-6">
              <label htmlFor="logo" className="cursor-pointer inline-block relative w-[150px] h-[108px]">
                <Button type="button" onClick={() => setValue("logo", "/assets/200x144.svg")} variant="destructive" className="absolute -top-2 -right-2 p-0 h-6 w-6 rounded-full z-10"><X /></Button>
                <img src={watch("logo")} alt="logo" className="hover:opacity-70 transition-all duration-300 rounded-md w-full h-auto" />
                <Input type="file" accept=".png, .jpg, .jpeg, .svg, .webp" {...register("logo", { onChange: handleImageUpload })} className="hidden" id="logo" />
              </label>
              {mobile && <div className="relative">
                <Input {...register("invoice_number", {
                  onBlur: e => sessionStorage.setItem("invoice_number", e.target.value)
                })} />
                <Button onClick={generateinvoice_number} type="button" className="p-0 h-8 w-8 absolute top-1 bottom-1 right-1 aspect-square rounded-full bg-slate-200 hover:bg-slate-200/80"><RotateCcw className="text-slate-700 scale-90" /></Button>
              </div>}
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 sm:border sm:border-slate-100 rounded-md sm:p-4 mt-12">
            <h3 className="font-semibold text-slate-700 sm:hidden">Biller</h3>
            <div className="">
              <Label className="hidden sm:inline-block mb-2">Biller name</Label>
              <Input className="shadow-sm" {...register("biller_name", {
                onBlur: e => sessionStorage.setItem("biller_name", e.target.value)
              })} placeholder="Biller name" />
              {formErrors.biller_name && <p className="text-destructive text-xs flex items-center mt-1"><OctagonAlert className="h-4" /> {formErrors.biller_name.message}</p>}
            </div>
            <div>
              <Label className="hidden sm:inline-block mb-2">Biller Address</Label>
              <Input className="shadow-sm" {...register("biller_address", {
                onBlur: e => sessionStorage.setItem("biller_address", e.target.value)
              })} placeholder="Biller address" />
              {formErrors.biller_address && <p className="text-destructive text-xs flex items-center mt-1"><OctagonAlert className="h-4" /> {formErrors.biller_address.message}</p>}
            </div>
            <div>
              <Label className="hidden sm:inline-block mb-2">Biller Email</Label>
              <Input className="shadow-sm" {...register("biller_email", {
                onBlur: e => sessionStorage.setItem("biller_email", e.target.value)
              })} placeholder="Biller Email" />
              {formErrors.biller_email && <p className="text-destructive text-xs flex items-center mt-1"><OctagonAlert className="h-4" /> {formErrors.biller_email.message}</p>}
            </div>
            <h3 className="font-semibold text-slate-700 sm:hidden mt-4">Client</h3>
            <div>
              <Label className="hidden sm:inline-block mb-2">Client Name</Label>
              <Input className="shadow-sm" {...register("customer_name", {
                onBlur: e => sessionStorage.setItem("customer_name", e.target.value)
              })} placeholder="Client company name" />
              {formErrors.customer_name && <p className="text-destructive text-xs flex items-center mt-1"><OctagonAlert className="h-4" /> {formErrors.customer_name.message}</p>}
            </div>
            <div>
              <Label className="hidden sm:inline-block mb-2">Client Address</Label>
              <Input className="shadow-sm" {...register("customer_address", {
                onBlur: e => sessionStorage.setItem("customer_address", e.target.value)
              })} placeholder="Client address" />
              {formErrors.customer_address && <p className="text-destructive text-xs flex items-center mt-1"><OctagonAlert className="h-4" /> {formErrors.customer_address.message}</p>}
            </div>
            <div>
              <Label className="hidden sm:inline-block mb-2">Client Email</Label>
              <Input className="shadow-sm" {...register("customer_email", {
                onBlur: e => sessionStorage.setItem("customer_email", e.target.value)
              })} placeholder="Client Email" />
              {formErrors.customer_email && <p className="text-destructive text-xs flex items-center mt-1"><OctagonAlert className="h-4" /> {formErrors.customer_email.message}</p>}
            </div>
            <div className="w-full hidden sm:block">
              <Label className="inline-block mb-2">Invoice date</Label>
              <Input className="shadow-sm" type="date" {...register("bill_date", {
                onBlur: e => sessionStorage.setItem("bill_date", e.target.value)
              })} />
              {formErrors.bill_date && <p className="text-destructive text-xs flex items-center mt-1"><OctagonAlert className="h-4" /> {formErrors.bill_date.message}</p>}
            </div>
            <div className="w-full hidden sm:block">
              <Label className="inline-block mb-2">Invoice Due Date</Label>
              <Input
                className="shadow-sm" type="date" {...register("due_date", { onBlur: e => sessionStorage.setItem("due_date", e.target.value) })} />
              {formErrors.due_date && <p className="text-destructive text-xs flex items-center mt-1"><OctagonAlert className="h-4" /> {formErrors.due_date.message}</p>}
            </div>

            {
              mobile &&
              <div className="grid grid-cols-2 gap-4 -mt-2">
                <div className="w-full">
                  <Label className="inline-block mb-2">Invoice date</Label>
                  <Input className="shadow-sm" type="date" {...register("bill_date", {
                    onBlur: e => sessionStorage.setItem("bill_date", e.target.value)
                  })} style={{ width: 'calc(50vw - 1.5rem)' }} />
                  {formErrors.bill_date && <p className="text-destructive text-xs flex items-center mt-1"><OctagonAlert className="h-4" /> {formErrors.bill_date.message}</p>}
                </div>
                <div className="w-full">
                  <Label className="inline-block mb-2">Invoice Due Date</Label>
                  <Input className="shadow-sm" type="date" {...register("due_date", {
                    onBlur: e => sessionStorage.setItem("due_date", e.target.value)
                  })} style={{ width: 'calc(50vw - 1.5rem)' }} />
                  {formErrors.due_date && <p className="text-destructive text-xs flex items-center mt-1"><OctagonAlert className="h-4" /> {formErrors.due_date.message}</p>}
                </div>
              </div>
            }
            <div>
              <Label className="hidden sm:inline-block mb-2">Currency</Label>
              <Input className="shadow-sm" {...register("currency", {
                onBlur: e => sessionStorage.setItem("currency", e.target.value)
              })} placeholder="Currency" />
              {formErrors.currency && <p className="text-destructive text-xs flex items-center mt-1"><OctagonAlert className="h-4" /> {formErrors.currency.message}</p>}
            </div>
          </div>
          <div className="mt-12 sm:mt-8">
            <h3 className="font-semibold text-slate-700 mb-4 sm:mb-0 sm:hidden">Invoice Items</h3>
            {!mobile && <Table className="rounded-tl-md rounded-tr-md overflow-hidden">
              <TableHeader className="hidden sm:contents">
                <TableRow className="bg-slate-700 hover:bg-slate-700">
                  <TableHead className="w-full text-white">Iten Description</TableHead>
                  <TableHead className="text-center min-w-20 text-white">Quantity</TableHead>
                  <TableHead className="text-right min-w-28 pr-8 text-white">Rate</TableHead>
                  <TableHead className="text-right min-w-40 text-white">Total</TableHead>
                  <TableHead className="text-center text-white">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  invoiceItems.length === 0 ?
                    <TableRow>
                      <TableCell className="text-center" colSpan={5}>Add an item to begin</TableCell>
                    </TableRow>
                    :
                    invoiceItems.map((item, index) => (
                      <TableRow className="" key={index}>
                        <TableCell className="">
                          <Input
                            onChange={(e) => handleChange(index, "description", e.target.value)}
                            name="description" value={item.description} placeholder='Item description'
                            className='w-[200px] sm:w-full'
                            onBlur={() => sessionStorage.setItem("invoiceItems", JSON.stringify(invoiceItems))}
                          />
                        </TableCell>
                        <TableCell className="">
                          <Input
                            value={item.quantity}
                            type="number" name="quantity" max="99999"
                            className='text-center'
                            onChange={(e) => {
                              const val = e.target.value;
                              const pattern = /^-?\d+$/;
                              if (pattern.test(val)) handleChange(index, "quantity", val);
                            }}
                            onBlur={() => sessionStorage.setItem("invoiceItems", JSON.stringify(invoiceItems))}
                          />
                        </TableCell>
                        <TableCell className="">
                          <Input
                            name="rate" value={item.rate} type="number"
                            className='text-right'
                            onChange={(e) => {
                              const val = e.target.value;
                              const pattern = /^-?\d+(\.\d+)?$/
                              if (pattern.test(val)) handleChange(index, "rate", val);
                            }}
                            onBlur={() => sessionStorage.setItem("invoiceItems", JSON.stringify(invoiceItems))}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {(Number(item.quantity) * Number(item.rate)).toLocaleString()}
                        </TableCell>
                        <TableCell className="">
                          <Button variant="destructive" onClick={() => removeItem(index)}>
                            <Trash />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                }
              </TableBody>
            </Table>}

            <React.Fragment>
              {
                mobile &&
                <div className="space-y-8">
                  {
                    invoiceItems.map((item, index) => (
                      <div className="grid gap-2">
                        <Input
                          onChange={(e) => handleChange(index, "description", e.target.value)}
                          name="description" value={item.description} placeholder='Item description'
                          className='w-full shadow-sm text-xs'
                          onBlur={() => sessionStorage.setItem("invoiceItems", JSON.stringify(invoiceItems))}
                        />
                        <div className="flex gap-2">
                          <Input
                            value={item.quantity}
                            type="number" name="quantity" min="0" max="99999"
                            placeholder="Quantity"
                            className='text-center flex-1 text-xs'
                            onChange={(e) => {
                              const val = e.target.value;
                              const pattern = /^-?\d+$/;
                              if (pattern.test(val)) handleChange(index, "quantity", val)
                            }}
                            onBlur={() => sessionStorage.setItem("invoiceItems", JSON.stringify(invoiceItems))}
                          />
                          <Input
                            name="rate" value={item.rate} type="number"
                            className='text-right flex-[2] text-xs'
                            placeholder="Rate"
                            onChange={(e) => {
                              const val = e.target.value;
                              const pattern = /^-?\d+(\.\d+)?$/
                              if (pattern.test(val)) handleChange(index, "rate", val);
                            }}
                            onBlur={() => sessionStorage.setItem("invoiceItems", JSON.stringify(invoiceItems))}
                          />
                          <Input
                            value={(Number(item.rate) * Number(item.quantity)).toLocaleString()}
                            className='text-right flex-[2] text-xs' disabled
                          />
                          <Button className="px-0 aspect-square" type="button" variant="destructive" onClick={() => removeItem(index)}>
                            <Trash />
                          </Button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              }
            </React.Fragment>
            <div className="mt-4 border-t pt-8 flex flex-col sm:flex-row items-start justify-between">
              <div className="sm:flex-1 w-full mt-4 sm:mt-0">
                <Button type="button" onClick={addItem} className="text-xs bg-muted" variant="outline">Add item</Button>
                <div className="hidden sm:block mt-8 w-full space-y-2">
                  <Label htmlFor="notes" className="text-slate-500 font-semibold text-xs">Notes</Label>
                  <Textarea {...register("notes", {
                    onBlur: e => sessionStorage.setItem("notes", e.target.value)
                  })}
                    id="notes" placeholder="Enter additional notes" className="resize-none"
                  />
                </div>
              </div>
              <div className="sm:flex-1" />
              <div className="flex-1 space-y-2 w-full sm:mt-0 mt-8">
                <div className="flex gap-6 justify-between items-center">
                  <h3>Sub total</h3>
                  <p>{total.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex gap-6 justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3>Tax (%)</h3>
                    <Input {...register("tax", {
                      onChange: e => {
                        if (isNaN(parseFloat(e.target.value))) {
                          setValue("tax", 0);
                          return;
                        };
                        setValue("tax", parseFloat(e.target.value));
                      }
                    })}
                      type="number" step={0.1} min={0} className="focus-visible:ring-0 w-16 text-center h-9 text-xs"
                    />
                  </div>
                  <p>{(total * watch("tax") / 100).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex gap-6 justify-between items-center">
                  <h3>Discount</h3>
                  <Input {...register("discount")} type="number" step={1} min={0} className="focus-visible:ring-0 w-32 text-right border-none p-0" />
                </div>
                <div className="flex gap-6 justify-between border-t pt-2">
                  <h3 className="font-semibold">Total</h3>
                  <p>{watch("currency")} {(total * (1 + (watch("tax") * 0.01)) - watch("discount")).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</p>
                </div>
              </div>
              <div className="mt-8 w-full space-y-2 block sm:hidden">
                <Label htmlFor="notes" className="text-slate-500 font-semibold">Notes</Label>
                <Textarea
                  {...register("notes", {
                    onBlur: e => sessionStorage.setItem("notes", e.target.value),
                    onChange: e => setValue("notes", e.target.value)
                  })}
                  id="notes" placeholder="Enter additional notes" className="resize-none"
                />
              </div>
            </div>
            <div className="py-8 flex justify-end space-x-4">
              <Button type="submit" className="px-8 h-12 w-full sm:w-[144px]" disabled={loading}>
                {loading ? <Loader className="animate-spin" /> : <><FileText /> Download</>}
              </Button>
            </div>
          </div>
        </div>
      </form>
      <div className="hidden">
        <PrintComponent invoiceFields={watch()} total={total} invoiceItems={invoiceItems} />
      </div>
    </section>
  )
}

export default NewInvoice;
