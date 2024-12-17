import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import axios, { AxiosRequestConfig } from "axios";
import React from "react";

interface IView {
  open: boolean;
  close: () => void;
  invoiceId: string | null;
}

const View = ({open, close, invoiceId}: IView) => {
  const token = sessionStorage.getItem('token');
  const getInvoice = async (id: string) => {
    const options: AxiosRequestConfig = {
      url: "invoice/view/" + id,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    try {
      const response = await axios.request(options);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  React.useEffect(() => {
    if(invoiceId) {
      getInvoice(invoiceId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId]);

  
  return (
    <AlertDialog open={open} onOpenChange={close}>
      <AlertDialogContent className="max-w-[900px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default View