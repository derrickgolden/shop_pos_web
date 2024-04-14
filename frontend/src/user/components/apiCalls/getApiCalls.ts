import axios from "axios";
import { server_baseurl } from "../../../baseUrl";
import Swal from "sweetalert2";
import { InvoiceDetails } from "./types";

interface ResponseData {
    success: boolean;
    details: InvoiceDetails[];
}

export const getPaymentDetails = async(data: string) =>{
    return await makeApiCall('user/pay-method/get-details', 'post', data).then((payments) =>{
        return payments.details.map((payment: {details: string}) =>{
            const details = JSON.parse(payment.details);
            return {...payment, details};
        })
    });
};

export const getCustomerInvoiceDetails = async(data: string): Promise<ResponseData> =>{
    const {sale_id} = JSON.parse(data);
    return await makeApiCall(`user/invoice/get-details/${sale_id}`, 'get', data);
};


const makeApiCall = async(url: string, method: string, data: string) =>{
    const tokenString = sessionStorage.getItem("userToken");

    if (tokenString !== null) {
        var token = JSON.parse(tokenString);
    } else {
        Swal.fire({
            title: "Token not Found",
            text: "Log out and log in then try again.",
            icon: "warning"
        });
        return {success: false, details: []};
    }

    let config = {
        method: method,
        maxBodyLength: Infinity,
        url: `${server_baseurl}/${url}`,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        data : data
    };

    return await axios.request(config)
    .then((response) => {
        if(response.data.success){
            return {success: true, details: response.data.details};
        }else{
            Swal.fire({
                text: `${response.data.msg}`,
                showCloseButton: true,
                showConfirmButton: false,
                animation: false,
                color: "#dc3545",
                padding: "5px"
            });
            return {success: false, details: []};
        };
    })
    .catch((error) => {
        console.log(error);
        Swal.fire({
            text: `${error.response.data?.msg || `Server Side Error`}`,
            showCloseButton: true,
            showConfirmButton: false,
            animation: false,
            color: "#dc3545",
            padding: "0px 0px 10px 0px"
        })
        return {success: false, details: []};
    });
};