export interface ILoginResponse {
  success: boolean;
  access_token: string;
  expiration: string;
  user: {
    id: string;
    email: string;
  }
}

export interface IInvoiceItem {
  description: string;
  quantity: string;
  rate: string;
  tax?: string;
}

export interface IInvoiceFields {
  logo?: string;
  invoiceNumber: string;
  billerName: string;
  billerAddress: string;
  billerEmail: string;
  customerName: string;
  customerAddress?: string;
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
}