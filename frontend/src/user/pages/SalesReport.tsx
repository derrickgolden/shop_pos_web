
import { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { getSalesReportApi } from './apiCalls/getSalesReport';
import { useDispatch, useSelector } from 'react-redux';
import { setSalesReportList } from '../../redux/salesReport';
import { RootState } from '../../redux/store';
import { ResultItem, calculateTotalSales } from './calculations/totalSalesUnits';
import ReportHeader, { SelectedDate } from '../components/reports/ReportHeader';
import SalesTable from "../components/reports/SalesTable";

export const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const SalesReport = () =>{
    const [sortedSalesByDateSelect, setSortedSalesByDateSelect] = useState<ResultItem>({
        accumulatedSales: [], sortedSales: []
    })
    const [selectedDate, setSelectedDate] = useState<SelectedDate>({
        startDate:  thirtyDaysAgo,
        endDate: new Date(),
    });
    const [graphWidth, setGraphWidth] = useState(window.innerWidth);

    const dispatch = useDispatch()
    const sales = useSelector((state: RootState) => state.salesReport)
    const activeShop = useSelector((state: RootState) => state.activeShop); 
    const apiCall = useSelector((state: RootState) => state.callApi); 

    useEffect(() =>{
        if(activeShop.shop ){
            const url = "sales/get-sales"
            const shop_id = activeShop.shop.shop_id
            const salesReport = getSalesReportApi({url, shop_id});
            salesReport.then((data) =>{
                const { success, details } = data;
                if(success){
                    dispatch(setSalesReportList(details));
                }
            })
        }
    }, [sales.length === 0, activeShop, apiCall]);

    useEffect(() =>{
        const sortedSalesByDate = calculateTotalSales({data: sales, date: selectedDate, keyType: "sales_items" })
        setSortedSalesByDateSelect(sortedSalesByDate);
    }, [sales, activeShop])

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
        const sortedSalesByDate = calculateTotalSales({data: sales, date, keyType: "sales_items"})
        setSortedSalesByDateSelect(sortedSalesByDate);
    }

    return(
        <div className='body2 bg-white pb-5' style={{paddingTop: "2rem"}}>
        <div className="upper-section bg-light mb-5">
            <ReportHeader 
                handleRegenerateGraph = {handleRegenerateGraph}
                salesData={sortedSalesByDateSelect?.sortedSales}
                dataType='Sales'
            />
            
           <div className='py-3 px-md-5 '>
                <button className="btn btn-outline-info border-start-0 border-end-0 rounded-0 col-12" 
                    type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" 
                    aria-controls="collapseExample">
                    Show/Hide sales graph
                </button>
           </div>
            <div className="collapse w-100 " id="collapseExample">
                <div className='d-flex flex-column flex-lg-row gap-4 px-md-5 pb-4'>
                    <div >
                        <h4 className='px-2 '>Unit Solid and Clients Served per Day</h4>
                        <LineChart width={graphWidth} height={300} data={sortedSalesByDateSelect?.accumulatedSales}>
                            <Line type="monotone" dataKey="Clients" stroke="#8884d8" />
                            <Line type="monotone" dataKey="units_sold" stroke="#0004d8" />
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                        </LineChart>
                    </div>
                    <div>
                        <h4 className='px-2 '>Daily Total Sales(Ksh) </h4>
                        <LineChart width={graphWidth} height={300} data={sortedSalesByDateSelect?.accumulatedSales}>
                            <Line type="monotone" dataKey="day_sales" stroke="#8884d8" />
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                        </LineChart>
                </div>
            </div>
            </div>
        </div>
        <SalesTable 
            salesData={sortedSalesByDateSelect?.sortedSales } 
            activeShop = {activeShop}    
        />
        </div>
    )
}

export default SalesReport;


