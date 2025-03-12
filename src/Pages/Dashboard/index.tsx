import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { CheckCircle, Download, FileText, Send, XCircle } from "lucide-react";
import React from "react";

interface IRecentInvoices {
  _id: string;
  invoice_number: string;
  customer_name: string;
  invoice_total: string;
  status: string;
  currency: string;
  created_at: string;
}

interface IRecentInvoicesResponse {
  success: boolean;
  data: Array<IRecentInvoices>;
}

const metrics = [
  {
    title: "Total Invoices",
    value: "23",
    icon: FileText,
    description: "All time",
  },
  {
    title: "Sent This Month",
    value: "8",
    icon: Send,
    description: "Last 30 days",
  },
  {
    title: "Settled",
    value: "15",
    icon: CheckCircle,
    description: "Paid invoices",
  },
  {
    title: "Pending",
    value: "8",
    icon: XCircle,
    description: "Awaiting payment",
  },
];

const Dashboard = () => {
  const toast = useToast().toast;
  const handleDownload = (id: string) => {
    toast({
      description: `Invoice ${id} has been downloaded.`
    });
  };
  
  const token = sessionStorage.getItem("token");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [recentInvoices, setRecentInvoices] = React.useState<Array<IRecentInvoices> | null>(null);
  const getRecent = async () => {
    setLoading(true);
    const options: AxiosRequestConfig = {
      url: "invoice/list/recent",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    try {
      const res = await axios.request(options);
      const data: IRecentInvoicesResponse = res.data;
      if (data.success) {
        setRecentInvoices(data.data);
        setLoading(false);
        return;
      }
      setLoading(false);
    } catch (error) {
      const err = error as AxiosError;
      if(err.status === 401) {
        window.location.replace("/auth/login");
      }
      setLoading(false);
    }
  }

  React.useEffect(() => {
    getRecent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout>
      <section className="p-4">
        <h3 className="text-xl font-semibold">Dashboard</h3>
        <p className="text-slate-600">Manage your invoices, track payments</p>
        <div className="h-8" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="h-8" />
        <div>
          <h3 className="font-semibold">Recent Invoices</h3>
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
                  (!loading && recentInvoices) && recentInvoices.map((invoice) => (
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
                          {/* <Button variant="outline" size="icon" onClick={() => handleSendEmail(invoice.invoice_number)}>
                            <Mail className="h-4 w-4" />
                          </Button> */}
                          <Button variant="outline" size="icon" onClick={() => handleDownload(invoice.invoice_number)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          {/* <Button variant="destructive" size="icon" onClick={() => handleDelete(invoice.invoice_number)}>
                            <Trash2 className="h-4 w-4" />
                          </Button> */}
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

export default Dashboard;