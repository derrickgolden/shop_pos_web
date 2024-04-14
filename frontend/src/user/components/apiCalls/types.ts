export interface InvoiceDetails {
    sale_id: number;
    sale_date: string;
    balance: string;
    payment_status:string;
    payment_details: { [key: string]: number };
    customer_id: number;
    full_name: string;
    email: string;
    phone: string;
    invoice_id: number;
    invoice_date: string;
    updated_at: string;
}
