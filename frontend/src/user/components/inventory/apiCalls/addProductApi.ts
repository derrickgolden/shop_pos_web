import axios from "axios";
import { server_baseurl } from "../../../../baseUrl";
import Swal from "sweetalert2";
import { NewProductDetailsProps } from "../types";
import { pricingDetails } from "../PricingDetailsCard";

interface handleAddGroupProps{
    addProductDetails:{
        newProductDetails: NewProductDetailsProps;
        pricingDetails: pricingDetails;
    };
    setShowDetails: (component: string) =>void;
    setIsLoading : React.Dispatch<React.SetStateAction<boolean>>;
    shop_id : number;
}

export const addProductApi = ({addProductDetails, setShowDetails, setIsLoading, shop_id}: handleAddGroupProps) =>{

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

    const {product_code, product_name, group_name, img_path, side_effect, group_id, instructions} = addProductDetails.newProductDetails
    const {price, package_cost, package_size} = addProductDetails.pricingDetails
    // Append newProductDetails
    // formData.append('newProductDetails', addProductDetails.newProductDetails);

    // Append pricingDetails
    // formData.append('pricingDetails', addProductDetails.pricingDetails);

    // Append newProductDetails
    formData.append('product_code', product_code);
    formData.append('product_name', product_name);
    formData.append('group_name', group_name);
    formData.append('side_effect', side_effect);
    formData.append('group_id', group_id.toString()); // Convert to string if necessary
    formData.append('instructions', instructions);

    // Append pricingDetails
    formData.append('price', price.toString());
    formData.append('package_size', package_size.toString());
    formData.append('package_cost', package_cost.toString());

    img_path ? formData.append('logo', img_path) : null;
    formData.append('shop_id', shop_id.toString());
    
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${server_baseurl}/user/inventory/add-product`,
        headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `${token}`
        },
        data : formData
    };

    axios.request(config)
    .then((response) => {
        if(response.data.success){
            setShowDetails("list");
            Swal.fire({
                title: "Success",
                text: "Product added successfully.",
                icon: "success"
            });
        }else{
            const msg = response.data.msg || "Server side error"
            Swal.fire({
                title: "Failed",
                text: `${msg}`,
                icon: "warning"
            });
        }
        setIsLoading(false)
    })
    .catch((error) => {
        console.log(error);
        const msg = error.response.data.msg || "Error, try again"
        Swal.fire({
            title: "Failed",
            text: `${msg}`,
            icon: "warning"
        });
        setIsLoading(false)
    });   
}