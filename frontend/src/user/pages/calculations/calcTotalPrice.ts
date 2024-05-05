import { OrderDetail } from "../SalesEntry";

export const calcTotalPrice = (orderDetails: OrderDetail[]) =>{
    let totalPrice  = 0;
    let total_profit = 0;
    orderDetails.map((item, i) => {
      totalPrice += Number(item.sub_total);
      total_profit += Number(item.profit);
    }) 
       console.log(total_profit)
    return {totalPrice, total_profit};
}