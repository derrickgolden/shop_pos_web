import axios from "axios";
import { server_baseurl } from "../../../../baseUrl";
import Swal from "sweetalert2";

interface handleAddGroupProps {
    addStockDetails: {  // Changed from addMedicineDetails to addStockDetails
        newStockDetails: {  // Changed from newMedicineDetails to newStockDetails
            group_id: number;
            stock_code: string;  // Changed from medicine_code to stock_code
            stock_name: string;  // Changed from medicine_name to stock_name
            group_name: string;  // Changed from group_name to group_name
            stock_qty: number;  // Changed from stock_qty to stock_qty
            instructions: string;
            side_effect: string;  // Changed from side_effect to side_effect
            img_path: File;
        }
        pricingDetails: {
            price: number,
            unit_of_measurement: number;  // Changed from unit_of_measurement to unit_of_measurement
            package_size: number;  // Changed from package_size to package_size
        }
    };
    setShowDetails: (component: string) => void;
    shop_id: number;  // Changed from pharmacy_id to shop_id
}

export const addStockApi = ({ addStockDetails, setShowDetails, shop_id }: handleAddGroupProps) => {  // Changed from addMedicineApi to addStockApi

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

    const { stock_code, stock_name, group_name, img_path, side_effect, group_id, instructions } = addStockDetails.newStockDetails;  // Changed from medicine_code, medicine_name, group_name to stock_code, stock_name, group_name
    const { price, unit_of_measurement, package_size } = addStockDetails.pricingDetails;  // Changed from price, unit_of_mesurement, package_size to price, unit_of_measurement, package_size

    formData.append('stock_code', stock_code);  // Changed from medicine_code to stock_code
    formData.append('stock_name', stock_name);  // Changed from medicine_name to stock_name
    formData.append('group_name', group_name);
    formData.append('side_effect', side_effect);
    formData.append('group_id', group_id.toString()); // Convert to string if necessary
    formData.append('instructions', instructions);

    formData.append('price', price.toString());
    formData.append('package_size', package_size.toString());
    formData.append('unit_of_measurement', unit_of_measurement.toString());  // Changed from unit_of_mesurement to unit_of_measurement

    formData.append('logo', img_path);
    formData.append('shop_id', shop_id.toString());  // Changed from pharmacy_id to shop_id

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${server_baseurl}/user/inventory/add-stock`,  // Changed from /user/inventory/add-medicine to /user/inventory/add-stock
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `${token}`
        },
        data: formData
    };

    axios.request(config)
        .then((response) => {
            if (response.data.success) {
                setShowDetails("list");
                Swal.fire({
                    title: "Success",
                    text: "Stock added successfully.",  // Changed from Medicine added successfully. to Stock added successfully.
                    icon: "success"
                });
            } else {
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
                text: `${error.response.data.msg}`,
                icon: "warning"
            });
        });
}
