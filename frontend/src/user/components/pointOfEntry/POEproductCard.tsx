import { FaInfoCircle } from "react-icons/fa";
import { shop } from "../../../assets/images"
import { ProductDetails } from "../../sections/pointOfEntry/types";
import { server_baseurl } from "../../../baseUrl";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
interface POEproductCardProps {
    handleNewOrderSelect: (newOrder: ProductDetails) =>void;
    productDetails: ProductDetails;
}

const POEproductCard: React.FC<POEproductCardProps> = ({productDetails, handleNewOrderSelect}) =>{
    const [isShowImages, setIsShowImages] = useState(true);
    const rerender = useSelector((state: RootState) => state.rerender); 

    const imgpath = productDetails?.img_path;
    const imgUrl = imgpath? `${server_baseurl}/uploads/${productDetails?.img_path}` : shop;

    useEffect(() =>{
        const val = localStorage.getItem("isShowImages");
        val ? setIsShowImages(JSON.parse(val).isShowImages): null;
    }, [rerender]);

    return(
        <button onClick={() => handleNewOrderSelect(productDetails)}
        className=" col-4 col-sm-3 col-lg-2 btn position-relative product-card "
        style={{padding: "1px"}}
         >
        <div className="card h-100 ">
            <div className="triangle position-absolute top-0 end-0"></div>
            <div  className="position-absolute top-0 end-0  text-white col-2 ">
                <FaInfoCircle
                style={{ cursor: 'pointer' }}
                />
            </div>
            {/* <div className="h-100 "> */}
                {
                    isShowImages? (
                        <img className="card-img-top my-0" src={imgUrl} 
                        alt="Product image"
                        style={{height: "60px"}}/>
                    ) : null
                }

                <span className="px-1 my-0 " 
                style={{height: "50px", textOverflow: 'ellipsis', overflow: "hidden", zIndex: "5" }}>
                        <b>{productDetails.product_name}</b>
                    </span>
                <p className="text-warning px-1">Ksh.{productDetails.price}</p>
            {/* </div> */}
        </div>
        </button>
    )
}

export default POEproductCard;