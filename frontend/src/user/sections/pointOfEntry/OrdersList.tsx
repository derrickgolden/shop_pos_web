import { useEffect, useRef, useState } from "react";
import { OrderDetail } from "../../pages/SalesEntry";
import OrderDisplay from "./OrderDisplay";
import { Order } from "./types";
import { EntryStepTypes } from "../../pages/types";
import DisplayOrdersList from "../../components/pointOfEntry/DisplayList";

interface OrdersListProps {
    ordersList: Order[];
    activeCard: number; 
    setEntryStep: React.Dispatch<React.SetStateAction<EntryStepTypes>>;
    handleNewCustomerOrder: ({date}: {date: string}) => void;
    handleDeleteCustomerOrder: (e: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>, order: Order) => void;
    setOrdersList:  React.Dispatch<React.SetStateAction<Order[]>>
}

const OrdersList: React.FC<OrdersListProps> = ({ordersList, activeCard,  
    setEntryStep, handleNewCustomerOrder, handleDeleteCustomerOrder, setOrdersList }) =>{

    const [showReview, setShowReview] = useState(false); 
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Scroll to the bottom when the component renders
        if (scrollRef.current) {            
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [activeCard]);

    const handleChangeActiveOrder = (order: Order) =>{
        setOrdersList((arr) => {
            return arr.map(prevOrder =>{
                if(prevOrder.date === order.date ){
                    // setEntryStep(order.status);
                    return({ ...prevOrder, activeOrder: true });   
                }else{
                    return({ ...prevOrder, activeOrder: false });
                };
            }); 
        });
    };

    const handleEntryStep = () =>{
        ordersList.map(orders =>{
            console.log(orders)
            if(orders.activeOrder){
                setEntryStep(obj =>({...obj, current: orders.status}));
            };
        });
    };

    const handleEditOrder = (order: OrderDetail) =>{
    }

    return(
        <div className="d-flex sales-entry-container" >
            <DisplayOrdersList
                showReview = {showReview} 
                handleEntryStep = {handleEntryStep} 
                handleNewCustomerOrder = {handleNewCustomerOrder} 
                list = {ordersList}
                listType="ordering"
                handleChangeActiveOrder = {handleChangeActiveOrder} 
                handleDeleteCustomerOrder = {handleDeleteCustomerOrder} 
                setShowReview = {setShowReview}
            />
            <div className={`${showReview? "" : "d-none "} d-sm-block col-12 col-sm-6 col-md-5`} >
                {ordersList.map((order, i) =>{
                    return order.activeOrder === true ?
                        <OrderDisplay key={i}
                            windowDisplay = "orders"
                            activeCard = {activeCard}
                            handleEditOrder = {handleEditOrder}
                            orderDetails = {order.orderDetails}
                            totalPrice = {order.totalPrice}
                            setShowReview = {setShowReview}
                            handleEntryStep = {handleEntryStep}
                        /> : null
                    })
                }
            </div>
        </div>
    )
}

export default OrdersList;