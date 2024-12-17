import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IInvoiceFields, IInvoiceItem } from "@/lib/types";
import { FileText } from "lucide-react";
import { LegacyRef } from "react";

interface IPrintComponent {
  total: number;
  invoiceItems: Array<IInvoiceItem>;
  invoiceFields: IInvoiceFields;
  contentRef?: LegacyRef<HTMLDivElement> | undefined
}
export const PrintComponent = ({ invoiceFields, total, invoiceItems }: IPrintComponent) => {
  return (
      <div id="invoice" className="p-4 scale-95">
        <div className="flex gap-4 justify-between items-center">
          <div>
            <div className="flex items-start gap-2">
              <span className="p-3 bg-slate-700 rounded-tr-md rounded-bl-md"><FileText className="text-white" /></span>
              <h3 className="text-5xl font-semibold mb-4 text-slate-700">Invoice</h3>
            </div>
            <p>{invoiceFields.invoiceNumber}</p>
          </div>
          <div>
            {invoiceFields.logo !== "/assets/200x144.svg" && <img src={invoiceFields.logo} alt="logo" className="rounded-md max-w-[100px]" />}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 mt-4">
          <div className="space-y-2">
            <h3 className="font-bold text-xl text-slate-700">Biller:</h3>
            <div>
              <p className="text-sm">{invoiceFields.billerName}</p>
              <p className="text-sm">{invoiceFields.billerAddress}</p>
              <p className="text-sm">{invoiceFields.billerEmail}</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-xl text-slate-700">Bill To:</h3>
            <div>
              <p className="text-sm">{invoiceFields.customerName}</p>
              <p className="text-sm">{invoiceFields.customerAddress}</p>
              <p className="text-sm">{invoiceFields.customerEmail}</p>
            </div>
          </div>
          <div className="space-y-2 flex items-end">
            <div>
              <p className="text-sm">Invoice Date: {new Date(invoiceFields.billDate).toLocaleDateString()}</p>
              <p className="text-sm">Due Date: {new Date(invoiceFields.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Table className="border">
            <TableHeader className="bg-slate-700">
              <TableRow className="">
                <TableHead className="w-[40px] text-white">SN</TableHead>
                <TableHead className="text-white">Item Description</TableHead>
                <TableHead className="text-center text-white">Quantity</TableHead>
                <TableHead className="text-right text-white">Rate</TableHead>
                <TableHead className="text-right text-white">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                invoiceItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="w-10">{index + 1}</TableCell>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">{Number(item.rate).toLocaleString("en-US")}</TableCell>
                    <TableCell className="text-right">{(Number(item.quantity) * Number(item.rate)).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
          <div className="flex border-t pt-6 pr-4">
            <div className="flex-[2]" />
            <div className="flex-1 space-y-2">
              <div className="flex gap-6 justify-between items-center">
                <h3>Sub total</h3>
                <p>{total.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</p>
              </div>
              <div className="flex gap-6 justify-between items-center">
                <div className="flex items-center gap-2">
                  <h3>Tax ({invoiceFields.tax}%)</h3>
                </div>
                <p>{(total * invoiceFields.tax / 100).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</p>
              </div>
              <div className="flex gap-6 justify-between items-center">
                <h3>Discount</h3>
                {Number(invoiceFields.discount).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
              </div>
              <div className="flex gap-6 justify-between border-t pt-2 pb-4">
                <h3 className="font-semibold">Total</h3>
                <p>{invoiceFields.currency} {(((1 + invoiceFields.tax / 100) * total) - invoiceFields.discount).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })} </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-slate-700 py-4">Notes</h3>
          <p>{invoiceFields.notes}</p>
        </div>
      </div>
  )
}