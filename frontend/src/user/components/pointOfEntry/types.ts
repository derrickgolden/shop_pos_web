import { OrderDetail } from "../../pages/SalesEntry";
import { PaymentObject, SaleRes } from "../../pages/types";
import { BtnClicksProps, PaymentDetails } from "../../sections/pointOfEntry/types";
import { Customer } from "../customers/types";
import { PaymentCalcProps } from "./PaymentCalc";

export interface ChangeDisplayProps{
    customerGave: {[key: string]: number}; 
    totalPrice: number, 
    paymentDetails: PaymentDetails
}

export interface ValidateOrdersProps{
    handleVilidateClick: (
        customerGave: {[key: string]: number;}, 
        paymentDetails: PaymentDetails, 
        setIsvalidateEnabled: React.Dispatch<React.SetStateAction<boolean>> 
    ) =>void;
}

export interface ReceiptInvoiceProps{
    orderDetails: OrderDetail[]; 
    totalPrice: number; 
    componentRef: React.MutableRefObject<HTMLDivElement | null>;
    saleRes: SaleRes;
    selectCustomer: Customer | undefined
};


export interface PaymentMethodProps extends ValidateOrdersProps, PaymentCalcProps{
    activePayMethod: string;
    setActivePayMethod: React.Dispatch<React.SetStateAction<string>>;
    setBtnClicks: React.Dispatch<React.SetStateAction<BtnClicksProps>>;
    setPaymentDetails: React.Dispatch<React.SetStateAction<PaymentDetails>>; 
    customerGave: {[key: string]: number};
    setCustomeGave: React.Dispatch<React.SetStateAction<PaymentObject>>;
}