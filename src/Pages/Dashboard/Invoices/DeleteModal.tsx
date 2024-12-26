import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button";
import axios, { AxiosRequestConfig } from "axios";
import React from "react";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";

import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface IDeleteModal {
  open: boolean;
  close: () => void;
  invoiceId: string | null;
  fetchInvoice: () => Promise<void>;
}

const DeleteModal = ({ open, close, invoiceId, fetchInvoice }: IDeleteModal) => {
  const token = sessionStorage.getItem('token');
  const toast = useToast().toast;
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleDelete = async () => {
    setLoading(true);
    const options: AxiosRequestConfig = {
      url: "invoice/delete?id=" + invoiceId,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      },
    }
    try {
      const response = await axios.request(options);
      if (response.status === 200) {
        toast({
          title: "Invoice settled!",
        });
      }
      fetchInvoice();
      close();
      console.log(response);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }


  return (
    <AlertDialog open={open} onOpenChange={close}>
      <AlertDialogContent className="max-w-96">
        <AlertDialogHeader className="relative">
          <AlertDialogTitle className="flex justify-center">
            <Trash2 className="h-10 w-10 text-destructive" />
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            <p className="text-lg leading-5">Are you sure you want to delete this invoice?</p><br />
            <p className="text-center text-xs -mt-2">This will remain in the deleted items for the next 7 days before being permanently deleted.</p>
          </AlertDialogDescription>
          <div className="grid gap-4 grid-cols-2 pt-4">
            <Button disabled={loading} variant="destructive" onClick={handleDelete}>Delete</Button>
            <Button disabled={loading} variant="outline" onClick={close}>Cancel</Button>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  )
}

export default DeleteModal;
