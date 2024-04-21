import axios from "axios";
import { server_baseurl } from "../../../baseUrl";
import Swal from "sweetalert2";

interface ResponseData {
    success: boolean;
    details: [];
}

export const addCustomer = async (data: string): Promise<ResponseData> => {
    // const data = JSON.stringify({ shop_id, phone, full_name, email, country, address });
    return await makeApiCall('user/customer/add-customer', 'post', data);
};

export const addPaymentDetails = async (data: string): Promise<ResponseData> =>{
    return await makeApiCall('user/pay-method/add-details', 'post', data);
};

export const updateInvoiceDetails = async (data: string): Promise<ResponseData> =>{
    return await makeApiCall('user/invoice/update', 'post', data);
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
            Swal.fire({
                title: "Success",
                text: `${response.data.msg}`,
                icon: "success"
            });
            return {success: true, details: response.data.details};
        }else{
            Swal.fire({
                text: `${response.data.msg}`,
                showCloseButton: true,
                showConfirmButton: false,
                animation: false,
                color: "#dc3545",
                padding: "5px"
            })
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