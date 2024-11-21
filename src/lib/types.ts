export interface ILoginResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
    role: number;
    token: string;
    exp: string;
  }
}

export interface IInvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  tax?: number;
}

export interface IInvoiceFields {
  logo?: string;
  invoiceNumber: string;
  billerName: string;
  billerAddress: string;
  billerEmail: string;
  customerName: string;
  customerAddress: string;
  customerEmail?: string;
  billDate: Date;
  dueDate: Date;
  tax: number;
  shipping?: number;
  discount: number;
  amountPaid?: number;
  dueBalance?: number;
  currency: string;
  notes?: string;
  terms?: string;
}