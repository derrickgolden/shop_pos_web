import Swal from "sweetalert2";
import { calculateRemainingStock } from "../../controllers/calculations/calcRemainingStock";
import { OrderDetail } from "../SalesEntry";
import { Dispatch, SetStateAction } from "react";

export interface UpdateStockProps{
    product_id: number;
}

export const handleUpdatingStock = (product: OrderDetail, 
    setUpdateStock: Dispatch<SetStateAction<UpdateStockProps[]>>, 
    activeCard: number, newUnits: number, 
    useActiveCard = true) =>{

    const product2 = {
    unitsPerContainer: product.package_size,
    containersInStock: product.stock_qty,
    openContainerUnits: product.open_container_units,
    };

    const { error, msg, remainingContainers, remainingUnits  } = calculateRemainingStock( product2, newUnits);

    if(error){
        Swal.fire({
            icon: "error",
            title: "Oops...",
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
                if(!stockArr.some(stock => stock.product_id === product.product_id)){
                    return(
                        [...stockArr, 
                        {product_id: product.product_id, remainingContainers, remainingUnits}]
                    )
                }else{
                    return stockArr;
                };
            }
        })
    }
    const customer_note = product.customer_note || "";
    return { ...product, units: newUnits, sub_total: product.price * newUnits, customer_note };
}