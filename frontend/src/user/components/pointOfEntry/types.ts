import { PaymentObject } from "../../pages/types";

export interface ChangeDisplayProps{
    payMethods: string[], 
    totalPrice: number, 
    change:{change: number, remaining: number} 
}

export interface ValidateOrdersProps{
    handleVilidateClick: (customerGave: {[key: string]: number}, change: {}, setIsvalidateEnabled: React.Dispatch<React.SetStateAction<boolean>>) =>void;
    setPayMethods: React.Dispatch<React.SetStateAction<string[]>>;
    customerGave: {[key: string]: number};
    setCustomeGave: React.Dispatch<React.SetStateAction<PaymentObject>>;
}