import Swal from "sweetalert2";
import { calculateRemainingStock } from "../../controllers/calculations/calcRemainingStock";
import { OrderDetail } from "../SalesEntry";
import { Dispatch, SetStateAction } from "react";

export interface UpdateStockProps{
    product_id: number;
};

type HandleUpdatingStockParams = {
    orderDetail: OrderDetail;
    setUpdateStock: Dispatch<SetStateAction<UpdateStockProps[]>>;
    activeCard: number;
    newUnits: number;
    newDisc: number;
    newPrice: number;
    useActiveCard?: boolean;
};

export const handleUpdatingStock = ({orderDetail, setUpdateStock, activeCard, newUnits, 
    newDisc, newPrice, useActiveCard = true}: HandleUpdatingStockParams) =>{

    const { package_size, stock_qty, open_container_units, package_cost, product_id} = orderDetail;
    const product2 = {
        unitsPerContainer: package_size,
        containersInStock: stock_qty,
        openContainerUnits: open_container_units,
    };

    const { error, msg, remainingContainers, remainingUnits  } = calculateRemainingStock( product2, newUnits);
console.log(remainingContainers, remainingUnits);
    if(error){
        Swal.fire({
            icon: "error",
            title: "Sorry...",
            text: msg,
        });
    }else{
        setUpdateStock((stockArr) => {
            if(useActiveCard){
                const updatedStockArr = stockArr.map((item) => {
                    if (item.product_id === activeCard ) {
                        return {
                            product_id: activeCard,
                            remainingContainers,
                            remainingUnits
                        };
                    }else{
                        return item;
                    }
                }); 
                return updatedStockArr; 
            }else{
                if(!stockArr.some(stock => stock.product_id === product_id)){
                    return(
                        [...stockArr, 
                        {product_id, remainingContainers, remainingUnits}]
                    )
                }else{
                    return stockArr;
                };
            }
        })
    }

    const price = newPrice - newDisc;
    if(package_cost){
        var profit = (price - (package_cost / package_size)) * newUnits;
    }else{
        var profit = orderDetail.profit * newUnits;
        console.log(profit);
        console.log(orderDetail);
        
    }
    const sub_total = price * newUnits;
    const customer_note = orderDetail.customer_note || "";

    return { 
        ...orderDetail, 
        units: newUnits, 
        sub_total, 
        profit, 
        discount: newDisc, 
        price: newPrice,
        customer_note 
    };
}