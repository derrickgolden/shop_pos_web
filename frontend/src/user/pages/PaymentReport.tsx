import { useEffect, useState } from "react";
import ReportHeader, { SelectedDate } from "../components/reports/ReportHeader";
import { getSalesReportApi } from "./apiCalls/getSalesReport";
import { ResultItem } from "./calculations/totalSalesUnits";
import PayMethodTable from "../components/reports/PayMethodsTable";
import { thirtyDaysAgo } from "./SalesReport";
import { calcSalesPayMethodTotals } from "./calculations/calcSalesPayMethodsTotals";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const PaymentReport = () =>{
    const [salesPayMethods, setSalesPayMethods] = useState([]);
    const [sortedSalesByDateSelect, setSortedSalesByDateSelect] = useState<ResultItem>({
        amtPerMethod: [], transPerMethod: [], sortedSales: []
    });
    const activePharmacy = useSelector((state: RootState) => state.activePharmacy);

    useEffect(() =>{
        if(activePharmacy.pharmacy){
            const url = "pay-method/get-report";
            const pharmacy_id = activePharmacy.pharmacy?.pharmacy_id;
            const salesPayMethods = getSalesReportApi({url, pharmacy_id});
            salesPayMethods.then((data) =>{
                const sortedSalesByDate = calcSalesPayMethodTotals({data, date: {
                    startDate:  thirtyDaysAgo, endDate: new Date(),
                }, keyType: "payment_methods" });
    
                setSortedSalesByDateSelect(sortedSalesByDate);
                setSalesPayMethods(data);
            })
        }
    }, [activePharmacy]);

    const handleRegenerateGraph = (date: SelectedDate) =>{
        if(date.endDate === null){
            date.endDate = new Date();
        }
        const sortedSalesByDate = calcSalesPayMethodTotals({data: salesPayMethods, date, keyType: "payment_methods" })
        setSortedSalesByDateSelect(sortedSalesByDate);
    }
    return(
        <div className='body2 bg-white pb-5' style={{paddingTop: "2rem"}}>
            <div className="upper-section bg-light mb-5 ">
                <ReportHeader 
                    handleRegenerateGraph = {handleRegenerateGraph}
                    salesData={sortedSalesByDateSelect?.sortedSales}
                    dataType = { "Payments" }
                />
                <div className='py-3 px-md-5 '>
                    <button className="btn btn-outline-info border-start-0 border-end-0 rounded-0 col-12" 
                    type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                        Show/Hide Payment Methods Graph
                    </button>
            </div>
                <div className="collapse col-12" id="collapseExample">
                    <div className='d-lg-flex flex-row  gap-4 px-5 pb-4 col-12'>
                        <div>
                            <h4 className="col-12">Total amount(Ksh) per payment method</h4>
                            <LineChart width={400} height={300} data={sortedSalesByDateSelect?.amtPerMethod}>
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
                        <h4>Total Transactions per payment method </h4>
                            <LineChart width={400} height={300} data={sortedSalesByDateSelect?.transPerMethod}>
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
                salesData={sortedSalesByDateSelect?.sortedSales} 
                activePharmacy = {activePharmacy}
            />
        </div>
    )
}

export default PaymentReport;