
export interface RegisterSalesProp{
    orderDetails: [];
    totalPrice: number;
    total_profit: number;
    moneyTrans: {
        customerGave: {}, 
        change: number;
        remaining: number;
        payment_status: 'Paid'|'Pending'|'Overdue'|'Partially Paid'|'Cancelled'|'Refunded';
    };
    updateStock: {product_id: number, remainingContainers: number, remainingUnits: number}[];
    shop_id: number;
    sale_date: Date;
    invoiceDetails: {
        sendInvoice: boolean;
        customer_id: number | undefined;
    }
}

export interface RegisterShopProps{
    shopDetails:{
        shop_name: string;
        location: string;
        shop_email: string;
        shop_tel: string;
        extra_info: string;
    }
    user: {
        user_id: number
    }
    logo: {
        path: string;
        filename : string;
    }
};

export interface UpdateInvoiceProps {
    remaining: number;
    change: number;
    payment_status: string;
    customerGave: {[key: string]: string};
    sale_id: number;
    updated_at: Date;
}

