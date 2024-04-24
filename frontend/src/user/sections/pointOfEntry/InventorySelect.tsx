import { useDispatch, useSelector } from "react-redux";
import ProductSelectNavbar from "../../components/pointOfEntry/ProductSelectNavbar";
import POEproductCard from "../../components/pointOfEntry/POEproductCard";
import { RootState } from "../../../redux/store";
import { useEffect, useState } from "react";
import { getProductGroupList } from "../../components/inventory/productGroup/apiCalls/getProductGroupList";
import { setGroupList } from "../../../redux/groupList";
import OrdersCard from "../../components/pointOfEntry/OrdersCard";
import { FaOpencart } from "react-icons/fa";
import { getSessionStorage } from "../../controllers/getSessionStorage";
import { InventorySelectProps } from "./types";

const InventorySelect: React.FC<InventorySelectProps> = ({ handleNewOrderSelect, 
    handleEditOrder, orderDetails, handlePayment, setShowInventoryOrders, activeCard }) =>{

    const [groupNames, setGroupNames] = useState<string[]>([])
    const [showGroup, setShowGroup] = useState("All")
    const [searchProduct, setSearchProduct] = useState("")

    const dispatch = useDispatch()
    const productGroup = useSelector((state: RootState) => state.groupList);

    const userShop = getSessionStorage();
    const { localShop } = userShop;
    const order = orderDetails.find(item => item.product_id === activeCard)
    
    useEffect(()=>{
        const groupNames: string[] = productGroup.map((group) => {
            return group.group_name
        })
        setGroupNames(groupNames);
    }, [productGroup])
    useEffect(()=>{
            const filterNull = true;
            const shop_id = localShop?.shop_id;
            if(shop_id !== undefined){
                const res = getProductGroupList(filterNull, shop_id);
                res.then((data) =>{        
                    dispatch(setGroupList(data));
                })
            }
    },[productGroup.length === 0])
    
    return(
        <div className="col-12 px-0">
            <ProductSelectNavbar 
                groupNames = {groupNames}
                setShowGroup = {setShowGroup}
                setSearchProduct = {setSearchProduct}
            />
            <div className="d-flex flex-wrap align-items-start inventory-select col-12"> 
            {
                productGroup.map((group, i) =>{
                    if(showGroup === "All" || showGroup === group.group_name){
                        return group.products.map((product, j)=>{
                            if(product.product_name?.toLowerCase().match(searchProduct?.toLowerCase())){
                                const uniqueKey = i+j;
                                return <POEproductCard key={uniqueKey}
                                    productDetails ={product}
                                    handleNewOrderSelect = {handleNewOrderSelect}
                                />    
                            }
                        })
                    }
                })
            }
            </div>
            <div className="fixed-bottom d-md-none bg-light">
                {
                    order ? (
                        <OrdersCard 
                            key={0}
                            order = {order} 
                            activeCard={activeCard}
                            handleEditOrder= {handleEditOrder} 
                            orderDetails = {orderDetails}
                        />
                    ) : (
                        <div className="text-center">
                            <FaOpencart  />
                            <h3>The Cart is Empty</h3>
                        </div>
                    )
                }
                <div className="d-flex">
                    <button type="button" onClick={() => handlePayment()}
                    className="btn col-6 p- m-0 rounded-0 btn-warning">
                        <h5><b>Pay</b></h5>
                        {orderDetails.reduce((acc: number, detail) => acc + detail.sub_total, 0)} Ksh
                    </button>
                    <button type="button" onClick={() => setShowInventoryOrders("orders")}
                    className="btn col-6 p- m-0 rounded-0 
                    btn-info text-center">
                        <h5><b>Review</b></h5>
                        <span className="mb-0">{orderDetails.length} Items</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InventorySelect;