import axios from "axios";
import { server_baseurl } from "../../../baseUrl";
import Swal from "sweetalert2";
import { OrderDetail } from "../SalesEntry";
import { EntryStepTypes, SaleRes } from "../types";
import { Order } from "../../sections/pointOfEntry/types";
import { Dispatch, SetStateAction } from "react";

interface handleAddGroupProps{
    orderDetails: OrderDetail[];
    totalPrice : number;
    total_profit: number;
    setOrdersList: Dispatch<SetStateAction<Order[]>>;
    moneyTrans: {};
    updateStock: {}[];
    setEntryStep: React.Dispatch<React.SetStateAction<EntryStepTypes>>;
    setSaleRes: (saleRes: SaleRes) =>void;
    shop_id: number;
    isOnline: boolean;
    sale_date: Date;
    setIsvalidateEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    invoiceDetails: {
        sendInvoice: boolean;
        customer_id: number | undefined;
    }
}
export const regiterSalesApi = ({ orderDetails, totalPrice, total_profit, 
    setOrdersList, moneyTrans, updateStock, setEntryStep, setSaleRes, 
    shop_id, isOnline, sale_date, setIsvalidateEnabled, invoiceDetails}: handleAddGroupProps) =>{

    const tokenString = sessionStorage.getItem("userToken");

    if (tokenString !== null) {
        var token = JSON.parse(tokenString);
    } else {
        Swal.fire({
            title: "Token not Found",
            text: "Try to login Again then add the group.",
            icon: "warning"
        });
        return
    }

    // if (!isOnline) {
    //     Swal.fire({
    //         title: "Network connection",
    //         text: "Check your internet connection. Maybe disconnected or unstable",
    //         icon: "warning"
    //     });
    //     return
    // } 

    let data = JSON.stringify({orderDetails, totalPrice, total_profit, moneyTrans, 
        updateStock, shop_id, sale_date, invoiceDetails});

    const url = isOnline? `https://pharmabackend.karibuchakula.co.ke/user/sales/register-sales` : 
                `http://localhost:5020/user/sales/register-sales`

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${server_baseurl}/user/sales/register-sales`,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        data : data
    };

    axios.request(config)
    .then((response) => {
        if(response.data.success){
            setSaleRes(response.data.details[0]);
            setEntryStep({current: "receipt", prev: "payment"});
            setOrdersList(arr =>{
                return arr.map(order => order.activeOrder? {...order, status: "receipt"} : order)
            })
        }else{
            Swal.fire({
                title: "Failed",
                text: `${response.data.msg}`,
                icon: "warning"
            });
            setIsvalidateEnabled(true);
        }
    })
    .catch((error) => {
        console.log(error);
        Swal.fire({
            title: "Oooops...",
            text: `Server side error`,
            icon: "warning"
        });
        setIsvalidateEnabled(true);
    });   
}