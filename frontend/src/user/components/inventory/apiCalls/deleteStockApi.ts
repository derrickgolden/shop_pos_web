import axios from "axios";
import { server_baseurl } from "../../../../baseUrl";
import Swal from "sweetalert2";

interface updateStockProps {
    setShowDetails: (lists: string) => void;
    stock_id: number;  // Changed from medicine_id to stock_id
}

export const deleteStockApi = async ({ setShowDetails, stock_id }: updateStockProps) => {  // Changed from deleteMedicineApi to deleteStockApi

    const tokenString = sessionStorage.getItem("userToken");

    if (tokenString !== null) {
        var token = JSON.parse(tokenString);
    } else {
        Swal.fire({
            title: "Token not Found",
            text: "Try to login Again then add the group.",
            icon: "warning"
        });
        return;
    }

    const data = JSON.stringify({ stock_id });  // Changed from medicine_id to stock_id
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${server_baseurl}/user/inventory/delete`,  // No change in URL
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        data: data
    };

    return await axios.request(config)
        .then((response) => {
            if (response.data.success) {
                Swal.fire({
                    title: "Success",
                    text: "Stock Deleted Successfully.",  // Changed from Medicine Deleted Successfully. to Stock Deleted Successfully.
                    icon: "success"
                }).then((result) => {
                    setShowDetails("list");
                });
            } else {
                Swal.fire({
                    title: "Failed",
                    text: `${response.data.msg}`,
                    icon: "warning"
                });
            }
            return { success: response.data.success };
        })
        .catch((error) => {
            console.log(error);
            Swal.fire({
                title: "Failed",
                text: `Server side error`,
                icon: "warning"
            });
            return { success: false };
        });
}
