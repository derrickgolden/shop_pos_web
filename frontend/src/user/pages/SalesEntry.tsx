import { createContext, useContext, useEffect, useState } from "react";

import { ValidateOrders, PrintReceipt, OrdersList, ProductDetails, Order, 
  PaymentDetails, BtnClicksProps, SelectOrders, CustomerList,
  SalesList} from "../sections";
import POSnavbar from "../components/pointOfEntry/POSnavbar";
import { getSessionStorage } from "../controllers/getSessionStorage";

import { UpdateStockProps, handleUpdatingStock } from "./calculations/handleUpdatingStock";
import { calcTotalPrice } from "./calculations/calcTotalPrice";
import { regiterSalesApi } from "./apiCalls/registerSales";
import Swal from "sweetalert2";

import { CustomerContextType, EntryStepTypes, PaymentObject, SaleRes } from "./types";
import { Customer } from "../components/customers/types";
import { calcNewUnitDiscPrice } from "./calculations/calcNewUnitDiscPrice";
import { CustomerContext, SalesListContext } from "./createContext";
import { RefundDetailsObj } from "../sections/pointOfEntry/types";

export interface OrderDetail extends ProductDetails {
  units: number;
  sub_total: number;
  customer_note: string;
  profit: number;
  discount: number;
  refund_units: number;
}

const SalesEntry = () =>{
    const [activeCard, setActiveCard] = useState(0);
    const [ordersList, setOrdersList] = useState<Order[]>([{ date: new Date().toLocaleString(), 
      orderDetails: [], activeOrder: true, status: "inProgress" , totalPrice: 0, total_profit: 0,
      isRefund: false
    }]);
    const [entryStep, setEntryStep] = useState({current: "inProgress", prev: ""});

    // combine paymetod and customer gave in future;
    const [customerGave, setCustomeGave] = useState<PaymentObject>({});
    const [activePayMethod, setActivePayMethod] = useState("");
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
      remaining: 0, change: 0.00, payment_status: "Pending"
    });
    const [btnClicks, setBtnClicks] = useState<BtnClicksProps>({
      isNewPayment: true, isDigit: false, focusedBtn: "qty"
    });
    const [saleRes, setSaleRes] = useState<SaleRes>();
    const [updateStock, setUpdateStock] = useState<UpdateStockProps[]>([]);
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
        setBtnClicks,

        handleDigitClick: (digit: number) => {
          setOrdersList((arr) => {
            return arr.map((order) =>{
              if(order.activeOrder){
                const newDetails =  order.orderDetails.map(orderDetail => {
                  if (orderDetail.product_id === activeCard && orderDetail.units >= 0) {                    
                    const {newUnits, newDisc, newPrice} = calcNewUnitDiscPrice({
                      btnClicks, orderDetail, operator: "digitClick", setBtnClicks, digit
                    });
                    return handleUpdatingStock({orderDetail, setUpdateStock, activeCard, newUnits, newDisc, newPrice});
                  };
                  return orderDetail;
                });

                const {totalPrice, total_profit} = calcTotalPrice(newDetails);
                return {...order, orderDetails: newDetails, totalPrice, total_profit };
              }else{
                return order;
              };
            });
          });
        },
      
        handleQuantityIncByOne: () => {
          // Your logic for handling quantity increment by one          
          setOrdersList((arr) => {
            return arr.map(order =>{
              if(order.activeOrder){
                const newOrders = order.orderDetails.map(orderDetail => {
                  if (orderDetail.product_id === activeCard) {
                    // check if we are updating qty | discount | price
                    const {newUnits, newDisc, newPrice} = calcNewUnitDiscPrice({
                      btnClicks, orderDetail, operator: "add", setBtnClicks, digit: 1,
                    });
                    const newOrderDetails = handleUpdatingStock({
                      orderDetail, setUpdateStock, activeCard, newUnits, newDisc, newPrice
                    });

                    return newOrderDetails;
                  } else {
                    return orderDetail;
                  }
                });
                const{ totalPrice, total_profit }= calcTotalPrice(newOrders);
                return {...order, orderDetails: newOrders, totalPrice, total_profit};
              }
              return order
            })            
          });
        },
      
        handleDecreaseNcancelOrder: () => {
          // Your logic for setting to Decrement and cancel order
          setOrdersList((arr) => {
            return arr.map(order =>{
              const {activeOrder, orderDetails} = order;
              if(activeOrder){
                const [orderDetail] = orderDetails.filter(orderDetail=> orderDetail.product_id === activeCard);
                if(orderDetail){

                  const {focusedBtn} = btnClicks;
                  if((focusedBtn === 'qty' && orderDetail.units > 0) || 
                    (focusedBtn === 'disc' && orderDetail.discount > 0) || 
                    (focusedBtn === 'price' && orderDetail.price > 0)){
                    const newDetails = orderDetails.map(orderDetail => {
                      if (orderDetail.product_id === activeCard ) {
                        const {newUnits, newDisc, newPrice} = calcNewUnitDiscPrice({
                          btnClicks, orderDetail, operator: "slice", setBtnClicks, digit: 0
                        });
                        const newOrderDetails = handleUpdatingStock({
                          orderDetail, setUpdateStock, activeCard, newUnits, newDisc, newPrice
                        });
                        
                        return newOrderDetails;
                      } else {
                        return orderDetail;
                      }
                    })
  
                    const{ totalPrice, total_profit }= calcTotalPrice(newDetails);
                    return { ...order, orderDetails: newDetails, totalPrice, total_profit };
                  }else if(focusedBtn === 'qty'){
                    setUpdateStock((stockArr) =>stockArr.filter(stock => stock?.product_id !== activeCard));
                    
                    const newOrderDetails =  order.orderDetails.filter(orderDetail =>{ 
                      return orderDetail?.product_id !== activeCard
                    });
                    setActiveCard(newOrderDetails[(newOrderDetails.length - 1)]?.product_id);
                    
                    const{ totalPrice, total_profit }= calcTotalPrice(newOrderDetails);
  
                    return { ...order, orderDetails: newOrderDetails, totalPrice, total_profit };
                  }else{
                    setBtnClicks((obj) => ({...obj, focusedBtn: 'qty'}));
                  }
                }
              }
              return order;
            })  
          });
        },
      
        handleRefund: () => {
          // Your logic for handling refund
          console.log('Handling Refund');
          setEntryStep({current: "salesList", prev: "inProgress"});
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
          console.log(ordersList);
          const [order] = (ordersList.filter(order => order.activeOrder));
          const {totalPrice, isRefund} = order;        
          if(totalPrice > 0 || isRefund){
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
            
    const handleNewOrderSelect = ( newOrder: ProductDetails | RefundDetailsObj, isRefund = false, units = 1 ) => {
      const {product_id, price} = newOrder;
      setOrdersList((arr) => {
        return arr.map(order => {
          if(order.activeOrder){
            const existingProduct = order.orderDetails.find(orderDetail => orderDetail.product_id === product_id);
            if (existingProduct) {
              const newOrders = order?.orderDetails.map(orderDetail => {
                if (orderDetail.product_id === product_id) {
                  const newUnits = orderDetail.units + units;
                  const newDisc = orderDetail.discount;
                  const newPrice = orderDetail.price;
                  const newOrderDetails = handleUpdatingStock({
                    orderDetail, setUpdateStock, activeCard, newUnits, newDisc, newPrice
                  });
  
                  return newOrderDetails;
                } else {
                  return orderDetail;
                };
              });
              
              const {totalPrice, total_profit} = calcTotalPrice(newOrders);
              return { ...order, orderDetails: newOrders, totalPrice, total_profit };
            }else{
              // calculate Remaining stock; 
              const useActiveCard = false;
              let orderDetail
              if(isRefund){
                orderDetail = newOrder;
              }else{
                orderDetail = {...newOrder, units, sub_total: 0, profit: 0, 
                  discount: 0, customer_note: "", refund_units: 0
                }
              }
              
              const newUpdateDetails = handleUpdatingStock({orderDetail, setUpdateStock, activeCard,
                 newUnits: units, newDisc: 0, newPrice: price, useActiveCard
              });
              const updatedOrderDetails = [...order.orderDetails, newUpdateDetails];
              const {totalPrice, total_profit} = calcTotalPrice(updatedOrderDetails);
                
              console.log(total_profit);
              return { ...order, orderDetails: updatedOrderDetails, totalPrice, total_profit, isRefund };
            }
          }else{
            return order;
          }
        })
      });
      setActiveCard(product_id);
      // btnClicks.isDigit? setBtnClicks((obj) => ({...obj, isDigit: false})) :null;
      setBtnClicks((obj) => ({...obj, isDigit: false, focusedBtn: "qty"}));
    };
        
    const handleEditOrder = (order: OrderDetail) =>{
      setActiveCard(order.product_id);
      setBtnClicks((obj) => ({...obj, isDigit: false}));
    };

    const handleNewCustomerOrder = ({date}: {date: string}) =>{
      setOrdersList((arr) =>{
        if(arr.find(arr => arr.date === date)) return arr;
        
        arr.map((obj) =>{
          obj.activeOrder = false;
        })
        return [...arr, { date, orderDetails:[], activeOrder: true, status: "inProgress", 
          totalPrice: 0, total_profit: 0, isRefund: false }]
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
          status: "inProgress", totalPrice: 0 , total_profit: 0, isRefund: false}];
      });
    }
    
    const handleStartNewOrderClick = () =>{
      setOrdersList(arr =>{
        const removeOrder = arr.filter(order => !order.activeOrder);
        return [...removeOrder, { date: new Date().toLocaleString(), total_profit: 0,
          orderDetails: [], activeOrder: true, status: "inProgress", totalPrice: 0,
          isRefund: false,
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
      {(() => {
        switch(entryStep.current) {
          case "inProgress":
            return (
              <SelectOrders
                handleNewOrderSelect={handleNewOrderSelect}
                handleEditOrder={handleEditOrder}
                setShowInventoryOrders={setShowInventoryOrders}
                activeCard={activeCard}
                showInventoryOrders={showInventoryOrders}
                ordersList={ordersList}
                PoeCalcHandles={PoeCalcHandles}
                selectCustomer={selectCustomer}
                btnClicks={btnClicks}
              />
            );
          case "payment":
            return (                
              <CustomerContext.Provider value={{ selectCustomer, setSendInvoice, sendInvoice, setEntryStep }}>
                <ValidateOrders 
                  handleVilidateClick={handleVilidateClick}
                  totalPrice={(ordersList.filter(order => order.activeOrder))[0].totalPrice}
                  activePayMethod={activePayMethod} 
                  setActivePayMethod={setActivePayMethod}
                  customerGave={customerGave} 
                  setCustomeGave={setCustomeGave}
                  paymentDetails={paymentDetails}  
                  setPaymentDetails={setPaymentDetails}
                  btnClicks={btnClicks}
                  setBtnClicks={setBtnClicks}
                  setEntryStep={setEntryStep}
                />
              </CustomerContext.Provider>
            );
          case "receipt":
            return (
              <PrintReceipt 
                setEntryStep={setEntryStep}
                handleStartNewOrderClick={handleStartNewOrderClick}
                saleRes={saleRes}
                selectCustomer={selectCustomer}
                ordersList = {ordersList}
              /> 
            );
          case "ordersList":
            return (
              <OrdersList 
                ordersList={ordersList}
                setOrdersList={setOrdersList}
                activeCard={activeCard}
                setEntryStep={setEntryStep}
                handleNewCustomerOrder={handleNewCustomerOrder}
                handleDeleteCustomerOrder={handleDeleteCustomerOrder}
              />
            );
          case "customerList":
            return (
              <CustomerList 
                setEntryStep={setEntryStep}
                selectCustomer={selectCustomer}
                setSelectCustomer={setSelectCustomer}
              />
            );
          case "salesList":
            return(
              <SalesListContext.Provider value={{ setEntryStep, handleNewCustomerOrder, showInventoryOrders,
                PoeCalcHandles, selectCustomer, btnClicks, handleNewOrderSelect
              }}>
                <SalesList
                />
              </SalesListContext.Provider>
            )
          default:
            return null;
        }
      })()}
    </>  
  )
}

export default SalesEntry;

