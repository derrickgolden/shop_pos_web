import { Customer } from "../components/customers/types";
import { BtnClicksProps, RefundDetailsObj, PoeCalcHandlesProps } from "../sections/pointOfEntry/types";

export interface details{
    icon: JSX.Element;
    status: string;
    totals: number;
    caption: string;
    forCssDispaly: string;
    footerCaption: string;
    btnType: string;
    data: {}[];
}

export interface upperDashboardData{
    inventory: details;
    quickReport: details;
};

export interface lowerDashboardData{
    title: string;
    side_title_link: string;
    side_title_link_caption: string;
    left_totals: number;
    left_totals_caption: string;
    right_totals: number;
    right_totals_caption: string;
    display_date_picker: boolean;
    freq_bought_item?: string;
}

export interface SaleRes {
    sale_id: number;
    sale_date: string;
    change: number;
    remaining: number;
    customerGave: { [key: string]: number };
    invoice_id: number;
}

export interface paymentProps{
    sale_id: number,
    sale_date: Date,
    total_price: string,
    payment_methods:
        {
            amount: number,
            payment_method: "Bank" | "Cash" | "Customer account"
        }[]
};

export interface mappedPaymentProps{
    id: number;
    sale_id: number;
    sale_date: string;
    total_price: string;
    payment_methods: {
        amount: number;
        payment_method: "Cash" | "Bank" | "Customer account";
    }[];
};

export type PaymentObject = {
    [key: string]: number;
};

export type EntryStepTypes = {
    current: string;
    prev: string;
};

export interface CustomerContextType {
    selectCustomer: Customer | undefined;
    setSendInvoice: React.Dispatch<React.SetStateAction<boolean>>;
    sendInvoice: boolean;
    setEntryStep: React.Dispatch<React.SetStateAction<EntryStepTypes>>;
};

export interface SalesListContextProps{
    setEntryStep: React.Dispatch<React.SetStateAction<EntryStepTypes>>;
    handleNewCustomerOrder: ({date}: {date: string}) => void;
    showInventoryOrders: string;
    PoeCalcHandles: PoeCalcHandlesProps | undefined;
    selectCustomer: Customer | undefined;
    btnClicks: BtnClicksProps;
    handleNewOrderSelect: (
        newOrder: RefundDetailsObj | undefined, 
        isRefund: boolean, 
        units?: number
    ) =>void;
}