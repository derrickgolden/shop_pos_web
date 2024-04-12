export interface paymentDetailsFormatProps{
    details: {
        method: string;
        process: string;
    };
    inputs: {
        lebal: string;
        type: string;
        id: string;
    }[];
};

export const paymentDetailsFormat = [
    {
        details: {method: "Mpesa", process: "Send Money"}, 
        inputs: [
            {lebal: "Mpesa Number", type: "number", id: "mpesaNoInput"}, 
            {lebal: "Mpesa Names", type: "text", id: "mpesaNamesInput"}
        ]
    },
    {
        details: {method: "Mpesa", process: "Paybill"}, 
        inputs: [
            {lebal: "Account Number", type: "number", id: "accNumberInput"}, 
            {lebal: "Business Number", type: "text", id: "businessNoInput"}
        ]
    },
    {
        details: {method: "Bank", process: "Check/Deposit"}, 
        inputs: [
            {lebal: "Bank Name", type: "text", id: "bankNameInput"},
            {lebal: "Account Name", type: "text", id: "accNameInput"}, 
            {lebal: "Account Number", type: "number", id: "accNoInput"}
        ]
    },
]