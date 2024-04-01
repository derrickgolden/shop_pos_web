import axios from "axios";
import { server_baseurl } from "../../../../baseUrl";
import Swal from "sweetalert2";
import { NavigateFunction } from "react-router-dom";

export interface shopDetails {
    shop_name: string;
     location: string;
     shop_email: string;
     shop_tel: string;
     extra_info: string;
     logo: File | null;
}
interface handleAddGroupProps{
    shopDetails: shopDetails;
    navigate: NavigateFunction;
}
export const regiterShopApi = ({shopDetails, navigate}: handleAddGroupProps) =>{

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

    const formData = new FormData();
    const {shop_name, location, shop_email, shop_tel, extra_info, logo} = shopDetails

    formData.append('shop_name', shop_name);
    formData.append('location', location);
    formData.append('shop_email', shop_email);
    formData.append('shop_tel', shop_tel);
    formData.append('extra_info', extra_info);
    logo? formData.append('logo', logo): null; 
    
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${server_baseurl}/user/register-shop`,
        headers: { 
            'Authorization': `${token}`
        },
        data : formData
    };

    axios.request(config)
    .then((response) => {
        if(response.data.success){
            Swal.fire({
                title: "Good job!",
                text: "Shop registered succefully!",
                icon: "success",
                confirmButtonText: "Ok",
              }).then((result) => {
                navigate(-1);
                setTimeout(() =>{
                    window.location.reload();
                }, 400);
              });
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
            title: "Oooops...",
            text: `Server side error`,
            icon: "warning"
        });
    });   
}