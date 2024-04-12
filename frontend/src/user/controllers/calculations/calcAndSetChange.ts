import { PaymentDetails } from "../../sections/pointOfEntry/types";

export const calcAndSetChange = ( totals: number, totalPrice: number ): PaymentDetails =>{
    if(totals === 0){
        return ({change: 0.00, remaining: (totalPrice - totals), payment_status: "Pending"});
    }else if(totals < totalPrice) {
        return ({change: 0.00, remaining: (totalPrice - totals), payment_status: "Partially Paid"});
    }else{
        return ({change: (totals - totalPrice), remaining: 0.00, payment_status: "Paid"});
    }
}


