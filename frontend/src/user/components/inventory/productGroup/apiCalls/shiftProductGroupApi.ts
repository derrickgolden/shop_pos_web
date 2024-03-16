import axios from "axios";
import { server_baseurl } from "../../../../../baseUrl";
import Swal from "sweetalert2";

export const shiftProductGroupApi = (group_id: number, product_id: number, handleClose: () => void) =>{

    const tokenString = sessionStorage.getItem("userToken");

    if (tokenString !== null) {
        var token = JSON.parse(tokenString);
    } else {
        Swal.fire({
            title: "Token not Found",
            text: "Try to login Again First.",
            icon: "warning"
        });
        return
    }

    let data = JSON.stringify({group_id, product_id});
    
    let config = {
        method: 'PATCH',
        maxBodyLength: Infinity,
        url: `${server_baseurl}/user/inventory/shift-group`,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        data : data
    };

    axios.request(config)
    .then((response) => {
        if(response.data.success){
            Swal.fire({
                title: "Success",
                text: "Product group shifted successfully.",
                icon: "success"
            });
            handleClose();
        }else{
            Swal.fire({
                title: "Failed",
                text: `${response.data.msg}`,
                icon: "warning"
            });
        }
    })
    .catch((error) => {
        console.log(error);
        Swal.fire({
            title: "Sorry",
            text: `Server side error`,
            icon: "warning"
        });
    });   
}