import { FaInfoCircle } from "react-icons/fa";
import { shop } from "../../../assets/images"
import { ProductDetails } from "../../sections/pointOfEntry/types";
interface POEproductCardProps {
    handleNewOrderSelect: (newOrder: ProductDetails) =>void;
    productDetails: ProductDetails;
}
const POEproductCard: React.FC<POEproductCardProps> = ({productDetails, handleNewOrderSelect}) =>{
    const imgpath = productDetails?.img_path;

    return(
        <button onClick={() => handleNewOrderSelect(productDetails)}
        className=" p-1 col-4 col-sm-3 col-lg-2 btn position-relative product-card "
         >
        <div className="card h-100 ">
            <div className="triangle position-absolute top-0 end-0"></div>
            <div  className="position-absolute top-0 end-0  text-white col-2 ">
                <FaInfoCircle
                style={{ cursor: 'pointer' }}
                />
            </div>
            <img className="card-img-top my-0" src={shop} 
            alt="Product image"
            style={{height: "60px"}}/>
           <span className="px-1 my-0" 
           style={{height: "50px", textOverflow: 'ellipsis', overflow: "hidden" }}>
                <b>{productDetails.product_name}</b>
            </span>
           <p className="text-warning px-1">Ksh.{productDetails.price}</p>
        </div>
        </button>
    )
}

export default POEproductCard;