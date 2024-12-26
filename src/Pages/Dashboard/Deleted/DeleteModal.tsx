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
import { Check, Download, Send, X } from "lucide-react";
import React from "react";
import { PrintComponent } from "@/Pages/NewInvoice/PrintComponent";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";

// @ts-expect-error module_file_declaration
import html2pdf from 'html2pdf.js';
import { useToast } from "@/hooks/use-toast";

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

const DeleteModal = ({ open, close, invoiceId }: IView) => {
  const toast = useToast().toast;
  const [loading, setLoading] = React.useState<boolean>(true);
  const [invoice, setInvoice] = React.useState<ISingleInvoice | null>(null);
  const [totals, setTotals] = React.useState<number>(0);
  const token = sessionStorage.getItem('token');
  const getInvoice = async (id: string) => {
    setLoading(true);
    const options: AxiosRequestConfig = {
      url: "invoice/delete?id=" + id,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    try {
      const response = await axios.request(options);
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

  const [pending, setPending] = React.useState<boolean>(false);
  const handleDownload = async () => {
    setPending(true);
    const elem = document.getElementById("invoice");
    setTimeout(() => {
      html2pdf(elem, {
        filename: 'Invoice ' + invoice?.invoice_number,
      });
      setPending(false);
    }, 2000);
  }

  const handleSettle = async () => {
    setPending(true);
    const options: AxiosRequestConfig = {
      url: "invoice/settle?id=" + invoiceId,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: { "status:": "settled" }
    }
    try {
      const response = await axios.request(options);
      if(response.data.success){
        toast({
          title: "Invoice settled!",
        });
      }
      close();
      console.log(response);
    } catch (error) {
      console.log(error);
      setPending(false);
    }
  }


  return (
    <AlertDialog open={open} onOpenChange={close}>
      <AlertDialogContent className="max-w-[900px] h-[90vh] overflow-y-auto">
        <AlertDialogTitle></AlertDialogTitle>
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
              invoice && <PrintComponent invoiceFields={invoice} total={totals} invoiceItems={invoice.invoice_items} />
          }
        </div>
        <div>
          <div className="flex items-center justify-between">
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button disabled={pending} onClick={handleSettle} className="w-32 bg-green-700"><Check /> Settle</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download Invoice</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex gap-1 justify-end">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button disabled={pending} onClick={handleDownload} className="w-32"><Download /> Download</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download Invoice</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button disabled={pending} className="w-32"><Send /> Send</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send to client</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteModal;
