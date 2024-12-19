import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ISingleInvoice } from "@/lib/types";
import axios, { AxiosRequestConfig } from "axios";
import { Download, Printer, Send, X } from "lucide-react";
import React from "react";
import { PrintComponent } from "@/Pages/NewInvoice/PrintComponent";

interface IView {
  open: boolean;
  close: () => void;
  invoiceId: string | null;
}

interface InvoiceData {
  data: {
    success: boolean
    data: ISingleInvoice;
  }
}

const View = ({ open, close, invoiceId }: IView) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [invoice, setInvoice] = React.useState<ISingleInvoice | null>(null);
  const [totals, setTotals] = React.useState<number>(0);
  const token = sessionStorage.getItem('token');
  const getInvoice = async (id: string) => {
    setLoading(true);
    const options: AxiosRequestConfig = {
      url: "invoice/view/" + id,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    try {
      const response = await axios.request(options);
      console.log({ response })
      const data = response.data as InvoiceData;
      if (data.data.success) {
        setInvoice(data.data.data);

        setLoading(false);
        return;
      }
      setLoading(false);
      console.log(response);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  React.useEffect(() => {
    const fetchInvoice = async () => {
      if (invoiceId) {
        await getInvoice(invoiceId);
      }
    };

    fetchInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId]);

  React.useEffect(() => {
    let total = 0;
    invoice?.invoice_items.forEach((item) => {
      total += parseFloat(item.rate) * parseFloat(item.quantity)
    });
    setTotals(total);
  }, [invoice, invoice?.invoice_items]);


  return (
    <AlertDialog open={open} onOpenChange={close}>
      <AlertDialogContent className="max-w-[900px]">
        <AlertDialogHeader className="relative">
          <Button variant="destructive" size="icon" className="absolute -top-4 -right-4" onClick={close}><X /></Button>
        </AlertDialogHeader>
        <div>
          {
            loading ?
              <div className="space-y-4">
                <Skeleton className="h-8 inline-block w-full" />
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-8 inline-block w-full" />
                  <Skeleton className="h-8 inline-block w-full" />
                  <Skeleton className="h-8 inline-block w-full" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-8 inline-block w-full" />
                  <Skeleton className="h-8 inline-block w-full" />
                  <Skeleton className="h-8 inline-block w-full" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-8 inline-block w-full" />
                  <Skeleton className="h-8 inline-block w-full" />
                  <Skeleton className="h-8 inline-block w-full" />
                </div>
                <Skeleton className="h-8 inline-block w-full" />
              </div>
              :
              invoice && (
                <PrintComponent invoiceFields={invoice} total={totals} invoiceItems={invoice.invoice_items} />
              )
          }
        </div>
        <div>
          <div className="flex gap-1 justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button><Download /></Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download Invoice</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button><Printer /></Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Print Invoice</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button><Send /></Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send to client</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <AlertDialogFooter>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default View