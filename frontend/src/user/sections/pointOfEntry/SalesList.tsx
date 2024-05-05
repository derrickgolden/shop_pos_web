import { useEffect, useState } from "react";
import DisplayOrdersList from "../../components/pointOfEntry/DisplayList";
import { getSessionStorage } from "../../controllers/getSessionStorage";
import { getSalesReportApi } from "../../pages/apiCalls/getSalesReport";
import { useDispatch, useSelector } from "react-redux";
import { SalesApiData, setSalesReportList } from "../../../redux/salesReport";
import { RootState } from "../../../redux/store";
import { useSalesListContext } from "../../pages/createContext";
import PoeCalcOrderDisplay from "./PoeCalcOrderDisplay";
import { SalesItemApiData } from "../../components/reports/types";
import Swal from "sweetalert2";
import { RefundDetailsObj } from "./types";

interface SalesListMapped extends Omit<SalesApiData, 'cashier' | 'sale_date'> {
  // Define additional properties or methods if needed
  cashier: string;
  sale_date: string;
};

const  SalesList = () =>{
    const [showReview, setShowReview] = useState(false);
    const [refundDetails, setRefundDetails] = useState<RefundDetailsObj[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [activeCard, setActiveCard] = useState(0);
    const [salesList, setSalesList] = useState<SalesListMapped[]>([]);
    const dispatch = useDispatch();
    // const salesList = useSelector((state: RootState) => state.salesReport);

    const {setEntryStep, handleNewCustomerOrder, showInventoryOrders,
        PoeCalcHandles, selectCustomer, btnClicks, handleNewOrderSelect
    } = useSalesListContext();

    const handleDigitClick = (digit: number) => {
        setRefundDetails(order => {
            return order.map((details) =>{
                const {product_id, units_sold, product_name} = details;
                if(product_id === activeCard){
                    if(units_sold >= digit){
                        return {...details, refund_units: digit};
                    }else{
                        Swal.fire(`You can not refund more than units sold (${units_sold}) for ${product_name}`);
                    };
                };
                return details;
            });
        });
    };

    const handlePayment = () =>{
        refundDetails.map((details, i) =>{
            const { refund_units } = details;
            if(refund_units && refund_units > 0){
                const units = refund_units * -1;
                const isRefund = true;
                handleNewOrderSelect( details, isRefund, units );
            };
        });
        setEntryStep({current: "inProgress", prev: "salesList"});
    };

    const poeCalcHandles = {...PoeCalcHandles, handleDigitClick, handlePayment};

    const {localShop} = getSessionStorage();
    useEffect(() =>{
        if(localShop){
            const url = "sales/get-sales"
            const shop_id = localShop.shop_id
            const salesReport = getSalesReportApi({url, shop_id});
            salesReport.then((data) =>{
                if(data.success){
                    const mappedData = data.details.map((sale) =>{
                        const {cashier, sales_items, sale_date} = sale;
                        const mappedItems = sales_items.map((item) =>{
                            return {...item, units: item.units_sold}
                        })
                        return {...sale, cashier: cashier.cashier_f_name, sales_items: mappedItems,
                            sale_date: new Date(sale_date).toLocaleString(),
                        };
                    })

                    setSalesList(mappedData);
                }
                // dispatch(setSalesReportList(data));
            })
        }
    }, []);
    
    const handleChangeActiveOrder = (sale: SalesApiData) =>{
        console.log(sale);
        const {sales_items, total_price} = sale;
        setRefundDetails(sales_items);
        setActiveCard(sales_items[0].product_id);
        setTotalPrice(Number(total_price));
        // setOrdersList((arr) => {
        //     return arr.map(prevOrder =>{
        //         if(prevOrder.date === order.date ){
        //             // setEntryStep(order.status);
        //             return({ ...prevOrder, activeOrder: true });   
        //         }else{
        //             return({ ...prevOrder, activeOrder: false });
        //         };
        //     }); 
        // });
    };

    const handleEntryStep = () =>{
        setEntryStep(obj =>({...obj, current: "inProgress"}));
    };
    
    const handleDeleteCustomerOrder = () =>{

    };

    const handleEditOrder = (order: SalesItemApiData) =>{
        setActiveCard(order.product_id);
        // setBtnClicks((obj) => ({...obj, isDigit: false}));
    };
    
    return(
        <div className="d-flex sales-entry-container">
            <DisplayOrdersList
                showReview = {showReview} 
                handleEntryStep = {handleEntryStep} 
                handleNewCustomerOrder = {handleNewCustomerOrder} 
                list = {salesList}
                listType = "refund"
                handleChangeActiveOrder = {handleChangeActiveOrder} 
                handleDeleteCustomerOrder = {handleDeleteCustomerOrder} 
                setShowReview = {setShowReview}
            />
            <PoeCalcOrderDisplay
                showInventoryOrders = {showInventoryOrders}
                activeCard={activeCard}
                handleEditOrder={handleEditOrder}
                orderDetails={refundDetails}
                totalPrice={totalPrice}
                PoeCalcHandles={poeCalcHandles}
                selectCustomer={selectCustomer}
                btnClicks={btnClicks}
            />
        </div>
    )
};

export default SalesList;