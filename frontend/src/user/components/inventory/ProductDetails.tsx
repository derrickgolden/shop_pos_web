import { useDispatch } from "react-redux";
import DetailCard from "./DetailCard"
import { deleteProductApi } from "./apiCalls/deleteProductApi";
import { ProductDetailsProps } from "./types";
import { setCallApi } from "../../../redux/callApi";
import Swal from "sweetalert2";

const ProductDetails: React.FC<ProductDetailsProps> = ({onHandleActionDetails, productDetails, setShowDetails}) =>{
    const dispatch = useDispatch();

    const handleProductDelete = (product_id: number, product_name: string) =>{
        Swal.fire({
            title: `Are you sure you want to delete ${product_name}?`,
            text: `All data will be lost including sales history related to the product.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteProductApi({setShowDetails, product_id}).then((data) =>{
                    dispatch(setCallApi(true));
                });
            }
        });
    }
    
    return(
        <div className="px-2 px-md-5">
            {
                <DetailCard 
                key={1}
                data ={productDetails}/>
            }
            <div className="bg-white d-flex gap-4 align-items-center justify-content-between" >
                <button type="button" 
                onClick={() => handleProductDelete(productDetails?.product_id, productDetails.product_name)}
                className="btn btn-outline-danger">Delete Product</button>
                <button onClick={() => setShowDetails("list")}
                    type="button" className="btn btn-primary text-white">
                        Back to Product List
                </button>
            </div> 
        </div>
    )
}

export default ProductDetails