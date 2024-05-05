import { FaRegNoteSticky } from "react-icons/fa6";
import { CommonSalesEntryProps } from "../../sections/pointOfEntry/types";
import { OrderDetail } from "../../pages/SalesEntry";

interface OrdersCardProps extends CommonSalesEntryProps{
    order: OrderDetail;
}

const OrdersCard: React.FC< OrdersCardProps > = ({ order, activeCard, handleEditOrder}) =>{
 
    return(
        <div onClick={() => handleEditOrder(order)}
            className={`p-2 order-display col-12
            ${activeCard === order?.product_id? "order-display-bg" : ""}`}>
                <div 
                    className={`d-flex justify-content-between `}>
                        <div>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <span className="text-poppins-semibold" style={{ whiteSpace: 'nowrap' }}>
                                {order.product_name}
                            </span>
                        </div>
                            <p className="mb-0"> 
                                <span className="text-poppins-semibold">{
                                    order.units
                                } &nbsp;</span> 
                                Units * {order.price} Ksh / Unit
                            </p> 
                            {
                                order.discount > 0 && 
                                <p className="mb-0 fst-italic"> With  &nbsp;
                                    <span className="text-poppins-semibold fst-italic">Ksh.{
                                        order.discount
                                    } &nbsp; </span> 
                                    discount per Unit
                                </p>                          
                            }                         
                            {
                                order.refund_units > 0 && 
                                <p className="mb-0 fst-italic"> To refund:&nbsp;
                                    <span className="text-poppins-semibold fst-italic">
                                        { order.refund_units } &nbsp; 
                                    </span>Unit(s)
                                </p>                          
                            }                         
                        </div>
                        <div className="text-poppins-semibold pl-3">
                            Ksh.{order.sub_total}
                        </div>
                </div>
                {
                    order.customer_note && (
                        <p className="mb-0 px-2 text-poppins " style={{backgroundColor: "#d6f7f7"}}>
                            <FaRegNoteSticky /> {order.customer_note}
                        </p>
                    )
                }
        </div>
    )
}

export default OrdersCard