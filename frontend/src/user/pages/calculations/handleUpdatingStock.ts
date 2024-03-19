import Swal from "sweetalert2";
import { calculateRemainingStock } from "../../controllers/calculations/calcRemainingStock";
import { OrderDetail } from "../SalesEntry";
import { Dispatch, SetStateAction } from "react";

export interface UpdateStockProps{
    product_id: number;
}

export const handleUpdatingStock = (product: OrderDetail, 
    setUpdateStock: Dispatch<SetStateAction<UpdateStockProps[]>>, 
    activeCard: number, newUnits: number, useActiveCard = true) =>{

    const { package_size, stock_qty, open_container_units, package_cost, price} = product;
    const product2 = {
        unitsPerContainer: package_size,
        containersInStock: stock_qty,
        openContainerUnits: open_container_units,
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

    const profit = (price- (package_cost / package_size)) * newUnits;
    const customer_note = product.customer_note || "";
    return { ...product, units: newUnits, sub_total: product.price * newUnits, profit, customer_note };
}