import { OrderDetail } from "../SalesEntry";

export const calcTotalPrice = (orderDetails: OrderDetail[]) =>{
  console.log(orderDetails)
    let totalPrice  = 0;
    let total_profit = 0;
    orderDetails.map((item, i) => {
      totalPrice += Number(item.sub_total);
      total_profit += Number(item.profit);
    }) 
       
    return {totalPrice, total_profit};
}