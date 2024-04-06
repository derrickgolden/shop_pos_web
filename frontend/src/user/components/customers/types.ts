
export interface CustomerProps{
    full_name: string;
    email: string;
    country: string;
    phone: string;
    address: string;
    shop_id: number;
}

export interface Customer extends CustomerProps{
    customer_id: number;
}

export interface NewCustomerDetailsProp{
    full_name: string, email: string, address: string
}

export interface CustomerDataTableProps{
    apidata: Customer[];
    search: string;
    columns: ({
        name: string;
        selector: (row: Customer) => number;
        sortable: boolean;
        cell?: undefined;
    } | {
        name: string;
        selector: (row: Customer) => string;
        sortable: boolean;
        cell?: undefined;
    } | {
        name: string;
        cell: (row: Customer) => JSX.Element;
        selector?: undefined;
        sortable?: undefined;
    })[]
}