import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { Search, Trash2, Undo2 } from "lucide-react";
import React from "react";

interface InvoicesInterface {
  _id: string;
  invoice_number: string;
  customer_name: string;
  invoice_total: string;
  status: string;
  currency: string;
  created_at: string;
}

interface InvoicesResponseInterface {
  success: boolean;
  data: Array<InvoicesInterface>;
}

const DeletedInvoices = () => {
  const toast = useToast().toast;
  const [search, setSearch] = React.useState<string>("");
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
  const handleDownload = (id: string) => {
    toast({
      description: `Invoice ${id} has been downloaded.`
    });
  };

  const token = sessionStorage.getItem("token");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [deletedInvoices, setDeletedInvoices] = React.useState<Array<InvoicesInterface> | null>(null);
  const getRecent = async () => {
    setLoading(true);
    const options: AxiosRequestConfig = {
      url: "invoice/deleted_items",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    try {
      const res = await axios.request(options);
      const data: InvoicesResponseInterface = res.data;
      if (data.success) {
        setDeletedInvoices(data.data);
        setLoading(false);
        return;
      }
      setLoading(false);
    } catch (error) {
      const err = error as AxiosError;
      if (err.status === 401) {
        window.location.replace("/auth/login");
      }
      setLoading(false);
    }
  }

  React.useEffect(() => {
    getRecent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log({ deletedInvoices });

  return (
    <DashboardLayout>
      <section className="p-4">
        <div className="flex  items-end gap-4 justify-between">
          <div>
            <h3 className="text-xl font-semibold">Invoices</h3>
            <p className="text-slate-600">Manage your invoices, track payments</p>
          </div>
          <div>
            <div className="relative w-full max-w-[300px] flex items-center">
              <Search className="absolute text-slate-300 w-5 left-2" />
              <Input onChange={handleSearch} value={search} className="w-full pl-8 text-slate-500" placeholder="Search..." />
            </div>
          </div>
        </div>
        <div className="h-8" />
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Invoice ID</TableHead>
                <TableHead className="text-xs">Client</TableHead>
                <TableHead className="text-xs">Amount</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                loading ?
                  [1, 2, 3, 4, 5].map(item => (
                    <TableRow key={item}>
                      <TableCell colSpan={6} className="py-1"><Skeleton className="h-8 w-full bg-slate-300" /></TableCell>
                    </TableRow>
                  ))
                  :
                  deletedInvoices && deletedInvoices.filter(item => {
                    if (search.trim() === "") return item;
                    if (item?.invoice_number?.toLowerCase().includes(search.toLowerCase())) return item;
                    if (item?.customer_name?.toLowerCase().includes(search.toLowerCase())) return item;
                  }).map((invoice) => (
                    <TableRow key={invoice._id}>
                      <TableCell className="font-medium text-xs min-w-24">{invoice.invoice_number}</TableCell>
                      <TableCell className="text-xs">{invoice.customer_name}</TableCell>
                      <TableCell className="text-xs">{invoice.currency + invoice.invoice_total}</TableCell>
                      <TableCell>
                        <span className={`capitalize p-2 rounded-full text-xs ${invoice?.status?.toLowerCase() === "settled"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                          }`}>
                          {invoice.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs min-w-28">{(invoice.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2 justify-center">
                          <Button variant="outline" size="icon" onClick={() => handleDownload(invoice._id)}>
                            <Undo2 className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        </div>
      </section>
    </DashboardLayout>
  )
}

export default DeletedInvoices;
