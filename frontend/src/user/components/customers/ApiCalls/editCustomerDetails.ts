import axios from "axios";
import { server_baseurl } from "../../../../baseUrl";
import Swal from "sweetalert2";
import { NewCustomerDetailsProp } from "../types";

interface EditCustomerDetailsProps extends NewCustomerDetailsProp{
    customer_id: number;
    shop_id: number;
    btnClose: React.RefObject<HTMLButtonElement>;
}

export const editCustomerDetails = async({shop_id, full_name, email, address, customer_id, btnClose}: EditCustomerDetailsProps) =>{
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

    const data = JSON.stringify({shop_id, full_name, email, address, customer_id });

    let config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `${server_baseurl}/user/customer/edit-details`,
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
                text: "Details edited successfully.",
                icon: "success"
            }).then(value => {
                if(btnClose.current && value.isConfirmed) btnClose.current.click();
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