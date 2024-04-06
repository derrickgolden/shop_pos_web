import axios from "axios";
import { server_baseurl } from "../../../../baseUrl";
import Swal from "sweetalert2";
import { CustomerProps } from "../types";

export const addCustomer = async({shop_id, phone, full_name, email, country, address}: CustomerProps) =>{
    const tokenString = sessionStorage.getItem("userToken");

    if (tokenString !== null) {
        var token = JSON.parse(tokenString);
    } else {
        Swal.fire({
            title: "Token not Found",
            text: "Try to login Again then add the customer.",
            icon: "warning"
        });
        return
    }

    const data = JSON.stringify({shop_id, phone, full_name, email, country, address });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${server_baseurl}/user/customer/add-customer`,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        data : data
    };

    await axios.request(config)
    .then((response) => {
        if(response.data.success){
            Swal.fire({
                title: "Success",
                text: "Customer added successfully.",
                icon: "success"
            });
        }else{
            Swal.fire({
                text: `${response.data.msg}`,
                showCloseButton: true,
                showConfirmButton: false,
                animation: false,
                color: "#dc3545",
                padding: "5px"
            })
        }
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
    });
}