import { useEffect, useState } from "react";
import ReportHeader, { SelectedDate } from "../components/reports/ReportHeader";
import { getSalesReportApi } from "./apiCalls/getSalesReport";
import { PayMethodResult } from "./calculations/calcSalesPayMethodsTotals";
import PayMethodTable from "../components/reports/PayMethodsTable";
import { thirtyDaysAgo } from "./SalesReport";
import { calcSalesPayMethodTotals } from "./calculations/calcSalesPayMethodsTotals";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const PaymentReport = () =>{
    const [salesPayMethods, setSalesPayMethods] = useState([]);
    const [sortedPaymentsByDateSelect, setSortedPaymentsByDateSelect] = useState<PayMethodResult>({
        amtPerMethod: [], transPerMethod: [], sortedPayments: []
    });
    const [graphWidth, setGraphWidth] = useState(window.innerWidth);

    const activeShop = useSelector((state: RootState) => state.activeShop);

    useEffect(() =>{
        if(activeShop.shop){
            const url = "pay-method/get-report";
            const shop_id = activeShop.shop?.shop_id;
            const salesPayMethods = getSalesReportApi({url, shop_id});
            salesPayMethods.then((data) =>{
                const { success, details } = data;
                if(success){
                    const sortedPaymentsByDate = calcSalesPayMethodTotals({data: details, date: {
                        startDate:  thirtyDaysAgo, endDate: new Date(),
                    }, keyType: "payment_methods" });
        
                    setSortedPaymentsByDateSelect(sortedPaymentsByDate);
                    setSalesPayMethods(details);
                }
            })
        }
    }, [activeShop]);

    useEffect(() =>{
        const screenWidth = window.innerWidth;
        if(screenWidth > 992){
            setGraphWidth((screenWidth/2) * 0.8)
        }else{
            setGraphWidth(screenWidth * 0.97)
        }
    }, []);

    const handleRegenerateGraph = (date: SelectedDate) =>{
        if(date.endDate === null){
            date.endDate = new Date();
        }
        const sortedPaymentsByDate = calcSalesPayMethodTotals({data: salesPayMethods, date, keyType: "payment_methods" })
        setSortedPaymentsByDateSelect(sortedPaymentsByDate);
    }
    return(
        <div className='body2 bg-white pb-5' style={{paddingTop: "2rem"}}>
            <div className="upper-section bg-light mb-5 ">
                <ReportHeader 
                    handleRegenerateGraph = {handleRegenerateGraph}
                    paymentData={sortedPaymentsByDateSelect?.sortedPayments}
                    dataType = { "Payments" }
                />
                <div className='py-3 px-md-5 '>
                    <button className="btn btn-outline-info border-start-0 border-end-0 rounded-0 col-12" 
                    type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                        Show/Hide Payment Methods Graph
                    </button>
            </div>
                <div className="collapse w-100" id="collapseExample">
                    <div className='d-lg-flex flex-row  gap-4 px-md-5 pb-4 col-12'>
                        <div className="mb-2">
                            <h4 className="px-2">Total amount(Ksh) per payment method</h4>
                            <LineChart width={graphWidth} height={300} data={sortedPaymentsByDateSelect?.amtPerMethod}>
                                <Line type="monotone" dataKey="Cash" stroke="#8884d8" />
                                <Line type="monotone" dataKey="Bank" stroke="#0004d8" />
                                <Line type="monotone" dataKey="Customer_account" stroke="#0004d8" />
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                            </LineChart>
                        </div>
                        <div>
                            <h4 className="px-2">Total Transactions per payment method </h4>
                            <LineChart width={graphWidth} height={300} data={sortedPaymentsByDateSelect?.transPerMethod}>
                                <Line type="monotone" dataKey="Cash" stroke="#8884d8" />
                                <Line type="monotone" dataKey="Bank" stroke="#0004d8" />
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                            </LineChart>
                        </div>
                    </div>
                </div>
            </div>
            <PayMethodTable 
                paymentData={sortedPaymentsByDateSelect?.sortedPayments} 
                activeShop = {activeShop}
            />
        </div>
    )
}

export default PaymentReport;