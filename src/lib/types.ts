export interface ILoginResponse {
  success: boolean;
  data: {
    access_token: string;
    expiration: string;
    user: {
      id: string;
      email: string;
    }
  }
}

export interface IInvoiceItem {
  description: string;
  quantity: string;
  rate: string;
  tax?: string;
}

export interface IInvoiceFields {
  invoice_number: string;
  biller_name: string;
  biller_address: string;
  biller_email: string;
  customer_name: string;
  customer_address?: string;
  customer_email?: string;
  bill_date: Date;
  due_date: Date;
  tax: number;
  discount: number;
  currency: string;
  notes?: string;
  logo?: string;
  shipping?: number;
  amount_paid?: number;
  due_balance?: number;
  deleted_at?: string;
}

export interface IInvoice extends IInvoiceFields {
  invoice_items: Array<IInvoiceItem>
}

export interface ISingleInvoice extends IInvoice {
  _id: string;
  created_at: string;
  status: string;
  created_by: string;
}