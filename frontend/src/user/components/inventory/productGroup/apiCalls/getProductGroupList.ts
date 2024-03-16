import axios from "axios";
import { server_baseurl } from "../../../../../baseUrl";
import Swal from "sweetalert2";
import { Group } from "../../../../../redux/groupList";

export const getProductGroupList = async(
        filterNull: boolean, shop_id: number, isOnline?: boolean
    ): Promise<Group[] | []> =>{

    const tokenString = sessionStorage.getItem("userToken");

    if (tokenString !== null) {
        var token = JSON.parse(tokenString);
    } else {
        Swal.fire({
            title: "Token not Found",
            text: "Try to login Again then add the group.",
            icon: "warning"
        });
        return []
    }
    
    const data = JSON.stringify({ filterNull, shop_id });
    const url = isOnline ? `https://pharmabackend.karibuchakula.co.ke/user/inventory/get-groups` :
                `http://localhost:5020/user/inventory/get-groups`;

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${server_baseurl}/user/inventory/get-groups`,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        data: data
    };

    return await axios.request(config)
    .then((response) => {
        if(response.data.success){ 
            return(response.data.details)
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
            text: `Server side error while fetching product List`,
            icon: "warning"
        });
    });   
}