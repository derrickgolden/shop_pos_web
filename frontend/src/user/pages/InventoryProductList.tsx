
import { useState } from "react";

import ProductDetails from "../components/inventory/ProductDetails";
import ProductList from "../components/inventory/ProductList";
import PagesHeader from "../components/sharedComponents/PagesHeader";
import { Product } from "../components/inventory/types";
import AddProductForm from "../components/inventory/AddProductForm";
import Swal from "sweetalert2";

const InventoryProductList = () =>{
    const [showDetails, setShowDetails] = useState("list")
    const [productDetails, setProductDetails] = useState<Product>()

    const handleActionDetails = (row: Product) =>{
        setProductDetails(row);
        setShowDetails("details");
    }
   
    const handleUpdateStock = (row: Product) =>{
        
        Swal.fire({
            title: `Do you want to update stock for ${row.product_name}?`,
            inputLabel: "New stock number(will be added to previous stock)",
            input: "number",
            showCancelButton: true,
            confirmButtonText: "Save",
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire("Saved!", "", "success");
            } else if (result.isDenied) {
              Swal.fire("Changes are not saved", "", "info");
            }
          });
    }

    return(
        <div className='body2 bg-white pb-5' style={{paddingTop: "2rem"}}>
            <PagesHeader 
                setShowDetails ={setShowDetails}
                btnInfo ={{text: "Add New Product", navigate: "addproduct", details: "product"}}
            />
            {showDetails === "list" && 
                <ProductList
                    onHandleActionDetails = {handleActionDetails} 
                    onHandleUpdateStock = {handleUpdateStock}
                />}
            {showDetails === "details" && productDetails &&
                <ProductDetails
                    onHandleActionDetails = {handleActionDetails}
                    productDetails = {productDetails}
                    setShowDetails = {setShowDetails}
                 />}
            {showDetails === "addproduct" && 
                <AddProductForm
                    setShowDetails = {setShowDetails}
                 />}
        </div>
    )
}

export default InventoryProductList;