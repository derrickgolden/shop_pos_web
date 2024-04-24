import InventorySelect from "./InventorySelect";
import OrderDisplay from "./OrderDisplay";
import POEcalc from "./POEcalc";
import { InventorySelectProps, Order, PosCalcProps } from "./types";

interface SalectOrdersProps extends Omit<InventorySelectProps, 'orderDetails' | 'handlePayment'>, PosCalcProps{
    ordersList: Order[];
    showInventoryOrders: string;
}
const SelectOrders: React.FC<SalectOrdersProps> = ({handleNewOrderSelect, handleEditOrder, ordersList,
    setShowInventoryOrders, activeCard, showInventoryOrders, PoeCalcHandles, selectCustomer, btnClicks}) =>{
    return(
        (() => {
            return ordersList.map((order, i) => {
            if(order.activeOrder){
                const {totalPrice, orderDetails} = order;
                return(
                    <div key={i}
                    className="sales-entry-container d-flex flex-column flex-md-row col-12">
                    <div className={`${showInventoryOrders === "orders" ? "" : "d-none "} d-md-flex 
                    flex-column col-12 justify-content-between col-md-5 p-0 grow-1`} >
                        <OrderDisplay 
                            activeCard={activeCard}
                            handleEditOrder={handleEditOrder}
                            orderDetails={orderDetails}
                            totalPrice={totalPrice}
                        />
                        <POEcalc 
                            PoeCalcHandles={PoeCalcHandles}
                            selectCustomer={selectCustomer}
                            btnClicks={btnClicks}
                        />
                    </div>
                    <div className={`${showInventoryOrders === "inventory" ? "" : "d-none"} 
                    col-md-7 px-0 d-md-flex`} >
                        <InventorySelect 
                            handleNewOrderSelect={handleNewOrderSelect}
                            handleEditOrder={handleEditOrder}
                            orderDetails={orderDetails}
                            handlePayment={PoeCalcHandles.handlePayment}
                            setShowInventoryOrders={setShowInventoryOrders}
                            activeCard={activeCard}
                        />
                    </div>
                </div>
                )
            }
            return null 
        })})()
    )
}

export default SelectOrders;