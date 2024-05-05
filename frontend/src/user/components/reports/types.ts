export interface subColumnsProps {
    sub_total: string;
    id: string;
    product_id: number;
    product_name: string;
    sales_item_id: number;
    units_sold: number;
    profit: number;
};

export interface SharedSalesProps{
    sale_id: number,
    sale_date: Date,
    customer_id: number;
    balance: string;
    total_price: string,
    total_profit: string,
    payment_status: string,
    cashier: {cashier_f_name: string, cashier_l_name: string, cashier_id: number},
}

export interface SalesItemApiData{
    product_id: number,
    product_name: string,
    sales_item_id: number,
    sub_total: number,
    units_sold: number,
    price: number;
    units?: number
}

export interface columnsProps extends SharedSalesProps{
    id: number;
    children: subColumnsProps[];
}[];

export interface PaymentDetailsProps {
    remaining: number;
    change: number;
    payment_status: string;
    customerGave: {[key: string]: string};
}
