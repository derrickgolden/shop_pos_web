import { createContext, useContext, useEffect, useState } from "react";

import { InventorySelect, OrderDisplay, POEcalc, ValidateOrders, PrintReceipt, 
  ListOfOrders, ProductDetails, Order } from "../sections";
import ValidateOrderNavbar from "../components/pointOfEntry/ValidateOrderNavbar";
import POSnavbar from "../components/pointOfEntry/POSnavbar";
import { getSessionStorage } from "../controllers/getSessionStorage";

import { UpdateStockProps, handleUpdatingStock } from "./calculations/handleUpdatingStock";
import { calcTotalPrice } from "./calculations/calcTotalPrice";
import { regiterSalesApi } from "./apiCalls/registerSales";
import Swal from "sweetalert2";

import { EntryStepTypes, PaymentObject, SaleRes } from "./types";
import CustomerList from "../sections/CustomerList";
import { Customer } from "../components/customers/types";
import { PaymentDetails } from "../sections/pointOfEntry/types";

export interface OrderDetail extends ProductDetails {
  units: number;
  sub_total: number;
  customer_note: string;
  profit: number;
}

interface CustomerContextType {
  selectCustomer: Customer | undefined;
  setSendInvoice: React.Dispatch<React.SetStateAction<boolean>>;
  sendInvoice: boolean;
  setEntryStep: React.Dispatch<React.SetStateAction<EntryStepTypes>>;
}

// Create the context
const CustomerContext = createContext<CustomerContextType>({
  selectCustomer: undefined, setSendInvoice: () =>{}, sendInvoice: false, 
  setEntryStep: () =>({current: "inProgress", prev: ""})
});

// Create a custom hook to consume the context
export const useCustomerContext = () => useContext(CustomerContext);

const SalesEntry = () =>{
    const [activeCard, setActiveCard] = useState(0);
    const [ordersList, setOrdersList] = useState<Order[]>([{ date: new Date().toLocaleString(), 
      orderDetails: [], activeOrder: true, status: "inProgress" , totalPrice: 0, total_profit: 0,
    }]);
    const [entryStep, setEntryStep] = useState({current: "inProgress", prev: ""});

    const [customerGave, setCustomeGave] = useState<PaymentObject>({});
    const [activePayMethod, setActivePayMethod] = useState("");
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
        remaining: 0, change: 0.00, payment_status: "Pending"
    });
    const [startNewEntry, setStartNewEntry] = useState(true);

    const [saleRes, setSaleRes] = useState<SaleRes>();
    const [updateStock, setUpdateStock] = useState<UpdateStockProps[]>([]);
    const [isDigitClicked, setIsDigitClicked] = useState(false);
    const [showInventoryOrders, setShowInventoryOrders] = useState("inventory");
    const [selectCustomer, setSelectCustomer] = useState<Customer>();
    const [sendInvoice, setSendInvoice] = useState(false);

    const [isOnline, setIsOnline] = useState(window.navigator.onLine);

    useEffect(() => {
      const handleOnline = () => {
        setIsOnline(true);
      };
  
      const handleOffline = () => {
        setIsOnline(false);
      };
  
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }, []);

    const userShop = getSessionStorage();
    const localShop = userShop.localShop;

    const PoeCalcHandles = {
        handleDigitClick: (digit: number) => {
          setOrdersList((arr) => {
            return arr.map((order) =>{
              if(order.activeOrder){
                const newDetails =  order.orderDetails.map(orderDetail => {
                  if (orderDetail.product_id === activeCard && orderDetail.units >= 0) {
                    let newUnits;
                    if(isDigitClicked){
                      const newUnitsAsString = orderDetail.units.toString() + digit.toString();
                      newUnits = parseInt(newUnitsAsString, 10);
                    }else{
                      newUnits = digit;
                      setIsDigitClicked(true);
                    }
  
                    return handleUpdatingStock(orderDetail, setUpdateStock, activeCard, newUnits);
                  }
                  return orderDetail
                })

                const {totalPrice, total_profit} = calcTotalPrice(newDetails);
                return {...order, orderDetails: newDetails, totalPrice, total_profit }
              }else{
                return order;
              }
            })
          })
        },
      
        handleQuantityIncByOne: () => {
          // Your logic for handling quantity increment by one          
          setOrdersList((arr) => {
            return arr.map(order =>{
              if(order.activeOrder){
                const newOrders = order.orderDetails.map(product => {
                  if (product.product_id === activeCard) {
                    const newUnits = product.units + 1;
                    const newOrderDEtails = handleUpdatingStock(product, setUpdateStock, activeCard, newUnits);
                    return newOrderDEtails;
    
                  } else {
                    return product;
                  }
                });
                const{ totalPrice, total_profit }= calcTotalPrice(newOrders);
                return {...order, orderDetails: newOrders, totalPrice, total_profit};
              }
              return order
            })            
          });
        },
      
        handleSetToQuantityChange: () => {
          // Your logic for setting to quantity change
          console.log('Setting to Quantity Change');
        },
      
        handleSetToGiveDiscount: () => {
          // Your logic for setting to give discount
          console.log('Setting to Give Discount');
        },
      
        handleSetToEditPrice: () => {
          // Your logic for setting to edit price
          console.log('Setting to Edit Price');
        },
      
        handleDecreaseNcancelOrder: () => {
          // Your logic for setting to Decrement and cancel order
          setOrdersList((arr) => {
            return arr.map(order =>{
              if(order.activeOrder){
                const [orderDetail] = order.orderDetails.filter(order=> order.product_id === activeCard);
                if(orderDetail?.units > 0){
                  const newDetails = order.orderDetails.map(orderDetail => {
                    if (orderDetail.product_id === activeCard && orderDetail.units > 0) {
                      const unitsString = orderDetail.units.toString();
    
                      const newUnits = Math.max(parseInt(unitsString.slice(0, -1), 10) || 0, 0);
                      
                      const newStockDetails = handleUpdatingStock(orderDetail, setUpdateStock, activeCard, newUnits);
                      return newStockDetails;
                    } else {
                      return orderDetail;
                    }
                  })

                  const{ totalPrice, total_profit }= calcTotalPrice(newDetails);
                  return { ...order, orderDetails: newDetails, totalPrice, total_profit };
                }else{
                  setUpdateStock((stockArr) =>stockArr.filter(stock => stock?.product_id !== activeCard));
                  
                  const newOrderDetails =  order.orderDetails.filter(orderDetail => orderDetail?.product_id !== activeCard);
                  setActiveCard(newOrderDetails[(newOrderDetails.length - 1)]?.product_id);
                  
                  const{ totalPrice, total_profit }= calcTotalPrice(newOrderDetails);

                  return { ...order, orderDetails: newOrderDetails, totalPrice, total_profit };
                }
              }
              return order;
            })  
          });
        },
      
        handleRefund: () => {
          // Your logic for handling refund
          console.log('Handling Refund');
        },
      
        handleCustomerNote: async() => {
          // Your logic for handling customer note
          let note;
          ordersList.map(order =>{
            if(order.activeOrder){
              order.orderDetails.map(orderDetail => {
                if(orderDetail.product_id === activeCard){
                  note = orderDetail.customer_note;
                }
              });
            }
          }) 

          const { value: text } = await Swal.fire({
            input: "textarea",
            inputLabel: "Customer Note",
            inputPlaceholder: "Type your note here...",
            inputValue: `${note}`,
            inputAttributes: {
              "aria-label": "Type your message here"
            },
            showClass: {
              popup: '',      // Disable show animation
            },
            showCancelButton: true,
            returnInputValueOnDeny:true
          });
          setOrdersList((arr) => {
            return arr.map(order =>{
              if(order.activeOrder){
                const newOrders = order.orderDetails.map(orderDetail => {
                  if (orderDetail?.product_id === activeCard) {
                    if (text) {
                      orderDetail.customer_note = text;
                    }else{
                      orderDetail.customer_note = "";
                    }
                    return orderDetail;
                  } else {
                    return orderDetail;
                  }
                });
                return {...order, orderDetails: newOrders};
              }
              return order
            })
          });
        },
      
        handlePayment: () => { 
          const totalPrice = (ordersList.filter(order => order.activeOrder))[0].totalPrice;        
          if(totalPrice > 0){
            setEntryStep({current: "payment", prev: "inProgress"})
            setOrdersList(arr =>{
              return arr.map(order => order.activeOrder? {...order, status: "payment"} : order)
            })
          }
        },

        handleCustomer: () => {
            // console.log("Handling Customer");
            setEntryStep({current: 'customerList', prev:"inProgress"});           
        }
    };
            
    const handleNewOrderSelect = ( newOrder: ProductDetails ) => {
      setOrdersList((arr) => {
            return arr.map(order => {
              if(order.activeOrder){
                const existingProduct = order.orderDetails.find(product => product.product_id === newOrder.product_id);
                if (existingProduct) {
                  const newOrders = order?.orderDetails.map(product => {
                    if (product.product_id === newOrder.product_id) {
                      const newUnits = product.units + 1;
                      const newUpdateDetails = handleUpdatingStock(product, setUpdateStock, activeCard, newUnits)
                      return newUpdateDetails;
                    } else {
                      return product;
                    }
                  });
                  
                  const {totalPrice, total_profit} = calcTotalPrice(newOrders);
                  return { ...order, orderDetails: newOrders, totalPrice, total_profit };
                }else{
                  // calculate Remaining stock; 
                  const newUnits = 1; 
                  const useActiveCard = false;
                  const orderDetail = {...newOrder, units: 1, sub_total: 0, profit: 0, customer_note: ""}
                  const newUpdateDetails = handleUpdatingStock(orderDetail, setUpdateStock, activeCard,
                     newUnits, useActiveCard)
                  const updatedOrderDetails = [...order.orderDetails, newUpdateDetails];
                    const {totalPrice, total_profit} = calcTotalPrice(updatedOrderDetails);
                    return { ...order, orderDetails: updatedOrderDetails, totalPrice, total_profit };
                }
              }else{
                return order;
              }
            })
          });
          setActiveCard(newOrder.product_id);
          isDigitClicked? setIsDigitClicked(false) :null;
    };
        
    const handleEditOrder = (order: OrderDetail) =>{
      setActiveCard(order.product_id);
      setIsDigitClicked(false);
    };

    const handleNewCustomerOrder = ({date}: {date: string}) =>{
      setOrdersList((arr) =>{
        if(arr.find(arr => arr.date === date)) return arr;
        
        arr.map((obj) =>{
          obj.activeOrder = false;
        })
        return [...arr, { date, orderDetails:[], activeOrder: true, status: "inProgress", totalPrice: 0, total_profit: 0 }]
      })
      setEntryStep(obj => ({...obj, current: "inProgress"}));
    }

    const handleDeleteCustomerOrder = (event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>, order: Order) =>{
      event.stopPropagation();

      setOrdersList((orders) => {
        const updatedArr = orders.filter(obj => obj.date !== order.date);
    
        if (updatedArr.length > 0) {
          const lastOrder = { ...updatedArr[updatedArr.length - 1], activeOrder: true };
          return [...updatedArr.slice(0, -1), lastOrder];
        }
        
        return [{ date: new Date().toLocaleString(), orderDetails:[], activeOrder: true, 
          status: "inProgress", totalPrice: 0 , total_profit: 0}];
      });
    }
    
    const handleStartNewOrderClick = () =>{
      setOrdersList(arr =>{
        const removeOrder = arr.filter(order => !order.activeOrder);
        return [...removeOrder, { date: new Date().toLocaleString(), total_profit: 0,
          orderDetails: [], activeOrder: true, status: "inProgress", totalPrice: 0
        }]
      })
      setCustomeGave({});
      setUpdateStock([]);
      setEntryStep(obj => ({current: "inProgress", prev: ""}));;
      setShowInventoryOrders("inventory");
      setSelectCustomer(undefined);
      setSendInvoice(false);
    };

    const handleVilidateClick = async( customerGave: {[key: string]: number;}, paymentDetails: PaymentDetails,
      setIsvalidateEnabled: React.Dispatch<React.SetStateAction<boolean>> ) =>{
        if(sendInvoice && !selectCustomer){
          await Swal.fire({
            text: "Select a Customer you want to generate invoice for!",
            showCancelButton: true,
          }).then(value =>{
            value.isConfirmed? setEntryStep({current: "customerList", prev: "payment"}) : null;
          });
          return setIsvalidateEnabled(true);
        };
        const [activeOrder] = ordersList.filter(order => order.activeOrder);
        const {orderDetails, total_profit, totalPrice} = activeOrder;
        const moneyTrans = {...paymentDetails, customerGave: customerGave};
        const shop_id = localShop?.shop_id;
        const sale_date = new Date();
        const invoiceDetails = {sendInvoice, customer_id: selectCustomer?.customer_id};

        if(shop_id !== undefined){
          regiterSalesApi({
            orderDetails, totalPrice, total_profit, setOrdersList, moneyTrans, updateStock, 
            setEntryStep, setSaleRes, shop_id, isOnline, sale_date, setIsvalidateEnabled, invoiceDetails
          });
        };
    };
   
    return(
      <>            
          <POSnavbar 
            entryStep={entryStep}
            isOnline={isOnline}
            ordersList={ordersList}
            setEntryStep={setEntryStep}
            setShowInventoryOrders={setShowInventoryOrders}
            showInventoryOrders={showInventoryOrders}
          />
        {
          entryStep.current === "inProgress" && 
            <div className="sales-entry-container d-flex flex-column flex-md-row col-12" >
              <div className={`${showInventoryOrders === "orders" ? "" : "d-none "} d-md-flex 
              flex-column col-12 justify-content-between col-md-5 p-0 grow-1`} >
                {
                  ordersList.map((order, i) =>{
                    const totalPrice = (ordersList.filter(order => order.activeOrder))[0].totalPrice;

                    return order.activeOrder ? 
                      <OrderDisplay key={i}
                          activeCard = {activeCard}
                          handleEditOrder = {handleEditOrder}
                          orderDetails = {order.orderDetails}
                          totalPrice = {totalPrice}
                      /> : null
                  })
                }
                  <POEcalc 
                      PoeCalcHandles= {PoeCalcHandles}
                      selectCustomer = {selectCustomer}
                  />
              </div>
              <div className={`${showInventoryOrders === "inventory" ? "" : "d-none"} 
              col-md-7 px-0 d-md-flex`} >
                {
                  ordersList.map((order, i) =>{
                    return order.activeOrder ? 
                      <InventorySelect 
                          key={i}
                          handleNewOrderSelect = {handleNewOrderSelect}
                          handleEditOrder = {handleEditOrder}
                          orderDetails = {order.orderDetails}
                          handlePayment= {PoeCalcHandles.handlePayment}
                          setShowInventoryOrders = {setShowInventoryOrders}
                          activeCard = {activeCard}
                      /> : null
                  })
                }
              </div>
            </div>
        }
        {
          entryStep.current === "payment" && 
          <div className="">
            <ValidateOrderNavbar 
              setEntryStep = {setEntryStep}
              totalPrice = {(ordersList.filter(order => order.activeOrder))[0].totalPrice}
              step = {{step: "payment"}}
            />
            <CustomerContext.Provider value={{ selectCustomer, setSendInvoice, sendInvoice, setEntryStep }}>
              <ValidateOrders 
                handleVilidateClick = {handleVilidateClick}
                totalPrice = {(ordersList.filter(order => order.activeOrder))[0].totalPrice}
                activePayMethod = {activePayMethod} 
                setActivePayMethod = {setActivePayMethod}
                customerGave = {customerGave} 
                setCustomeGave = {setCustomeGave}
                paymentDetails = {paymentDetails}  
                setPaymentDetails = {setPaymentDetails}
                startNewEntry = {startNewEntry} 
                setStartNewEntry = {setStartNewEntry}
              />
            </CustomerContext.Provider>
          </div>
        }
        {
          entryStep.current === "receipt" &&
          <div >
            <div className="d-none d-md-block">
              <ValidateOrderNavbar 
                setEntryStep = {setEntryStep}
                totalPrice = {(ordersList.filter(order => order.activeOrder))[0].totalPrice}
                step = {{step: "receipt"}}
              />
            </div>
            {
              ordersList.map((order, i) =>{
                return order.activeOrder && saleRes !== undefined ? 
                  <PrintReceipt 
                    key={i}
                    orderDetails ={order.orderDetails}
                    handleStartNewOrderClick = {handleStartNewOrderClick}
                    totalPrice = {(ordersList.filter(order => order.activeOrder))[0].totalPrice}
                    saleRes = {saleRes}
                    selectCustomer = {selectCustomer}
                  /> : null
              })
            }
          </div>
        }
        {
          entryStep.current === "ordersList" && 
          <ListOfOrders 
            ordersList = {ordersList}
            setOrdersList = {setOrdersList}
            activeCard = {activeCard}
            totalPrice = {(ordersList.filter(order => order.activeOrder))[0].totalPrice}
            setEntryStep = {setEntryStep}
            handleNewCustomerOrder = {handleNewCustomerOrder}
            handleDeleteCustomerOrder = {handleDeleteCustomerOrder}
          />
        }
        {
          entryStep.current === "customerList" && 
          <CustomerList 
            setEntryStep = {setEntryStep}
            selectCustomer = {selectCustomer}
            setSelectCustomer = {setSelectCustomer}
          />
        }
      </>
    )
}

export default SalesEntry;

