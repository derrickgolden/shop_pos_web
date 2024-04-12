export interface customerDataProps {
    full_name: string;
    email: string;
    country: string;
    phone: string;
    address: string;
    shop_id: number;
};

export interface paymentDetailsProps {
    payment_name: string, 
    paymentDetails: string;
    shop_id: number;
};