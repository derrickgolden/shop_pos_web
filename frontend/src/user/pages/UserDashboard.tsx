
import { MdOutlineEventAvailable } from "react-icons/md";
import { MdInventory } from "react-icons/md";
import { IoIosWarning } from "react-icons/io";

import TopSummaryCard from "../components/userDashboard/TopSummaryCard";
import BottomSummaryCard from "../components/userDashboard/BottomSummaryCard";
import { SetStateAction, useEffect, useState } from "react";
import { getStockDetailsApi } from "./apiCalls/getStockDetails";
import { details } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getProductGroupList } from "../components/inventory/productGroup/apiCalls/getProductGroupList";
import { getSalesReportApi } from "./apiCalls/getSalesReport";
import { setSalesReportList } from "../../redux/salesReport";
import { BottomSummaryCardProps } from "../components/userDashboard/types";
import ProfitCard from "../components/userDashboard/ProfitCard";

// {title: "My Shop", side_title_link: "#", side_title_link_caption: "Go to Configuration", left_totals: 18, left_totals_caption: "Total no of Suppliers", right_totals: 14, right_totals_caption: "Total no of Users", display_date_picker: false},
// {title: "Customers", side_title_link: "#", side_title_link_caption: "Go to Customer Page", left_totals: 298, left_totals_caption: "Total no of Customers", right_totals: 24, freq_bought_item:"Adalimumab", right_totals_caption: "Frequently bought item", display_date_picker: false}
const UserDashboard: React.FC = () =>{
    const dispatch = useDispatch();

    const shopListDetails = useSelector((state: RootState) => state.shopListDetailsList);
    const activeShop = useSelector((state: RootState) => state.activeShop); 

    const [ lowerDashboardData, setLowerDashboardData ] = useState<SetStateAction<BottomSummaryCardProps>>();
    const [ upperDashboardData, setUpperDashboardData ] = useState<details[]>();
    
    useEffect(() =>{
        let lowStockProduct: {}[] = [];
        let enoughStockProduct: {}[] = [];
        let productAvailable: {}[] = [];
        let productShortage: {}[] = [];
        
        if(activeShop.shop){
            const shop_id = activeShop.shop.shop_id;
            
            const stock = getStockDetailsApi(shop_id);
            stock?.then(data =>{
                data?.map((details: {containers: number, warning_limit: number, units_per_container: number}) =>{                
                    if(details.containers <= details.warning_limit && details.containers > 0){
                        lowStockProduct.push(details);
                    }else if(details.containers > details.warning_limit){
                        enoughStockProduct.push(details);
                    }
                    details.containers > 0 && details.units_per_container > 0 ? productAvailable.push(details) : productShortage.push(details);
                })
                
                setUpperDashboardData([
                    {icon:<MdInventory size={32}/>, status: "Good", totals: enoughStockProduct.length, caption: "Inventory Status", forCssDispaly: "success", footerCaption: "View detailed report", btnType: "inventory", data: enoughStockProduct}, 
                    {icon:<IoIosWarning size={32}/>, status: "Good", totals: lowStockProduct.length, caption: "Low Stock Warning", forCssDispaly: "warning", footerCaption: "View detailed report", btnType: "warning", data: lowStockProduct},
                    {icon:<MdOutlineEventAvailable size={32}/>, status: "Good", totals: productAvailable.length, caption: "Product Available", forCssDispaly: "info", footerCaption: "Visit inventory", btnType: "available", data: productAvailable},
                    {icon:<IoIosWarning size={32}/>, status: "Good", totals: productShortage.length, caption: "Products Shortage", forCssDispaly: "danger", footerCaption: "Resolve now", btnType: "shortage", data: productShortage}
                ])
            })
            
            if(shopListDetails.length > 0){
                const filterNull = false;
                const productList = getProductGroupList(filterNull, shop_id);
                productList.then((data) =>{
                    let totalProduct = 0;
                    const totalGroup = data.length;
                    data.map((details) =>{
                        if(details?.products[0].product_id !== null){
                            totalProduct += details.products.length;
                        }
                    })
                    
                    setLowerDashboardData((data: BottomSummaryCardProps) => ({...data,
                        inventory: {title: "Inventory", side_title_link: "/user/inventory/product-group", side_title_link_caption: "Go to Configuration", left_totals: totalProduct, left_totals_caption: "Total no of Products", right_totals: totalGroup, right_totals_caption: "Product Groups", display_date_picker: false}
                    }))
                })
                
                const url = "sales/get-sales"
                const salesReport = getSalesReportApi({url, shop_id});
                salesReport.then((data) =>{
                    const { success, details } = data;
                    if(success){
                        const invoices = details.length;
                        let productsSold = 0;
                        details.map((sale) =>{
                            productsSold += sale.sales_items.length
                        })
                        
                        setLowerDashboardData((data: BottomSummaryCardProps )  => ({...data,
                            quickReport: {title: "Quick Report", side_title_link: "#", side_title_link_caption: "Date", left_totals: productsSold, left_totals_caption: "Qty of Products Solid", right_totals: invoices, right_totals_caption: "Invoices Generated", display_date_picker: true},
                        }))
                        dispatch(setSalesReportList(details));
                    }
                })
            }
        }
    }, [shopListDetails, activeShop])
   
    return(
        <div  className='body2 bg-white' style={{paddingTop: "2rem"}}>
            <section className="upper-section px-0 px-sm-5 bg-light py-5 mb-3">
                <div className="d-flex justify-content-between align-items-center px-5 px-sm-0">
                    <div>
                        <h3 className="font-family-poppins font-weight-700 font-size-24 line-height-24 text-dark">
                            Dashboard
                        </h3>
                        <p className="font-family-poppins font-weight-400 font-size-14 line-height-21 text-dark">
                            A quick data overview of the inventory.
                        </p>
                    </div>
                    
                </div>
                <div className="d-flex flex-row flex-wrap justify-content-around">
                   {upperDashboardData? upperDashboardData.map((data, i) =>(
                    <TopSummaryCard 
                        key ={i}
                        data= {data}
                    />
                   )) : <h2>No data to display</h2> }
                </div>
            </section>
            <ProfitCard />
            <section className="lower-section bg-white d-flex flex-row flex-wrap justify-content-around">
                {lowerDashboardData? Object.values(lowerDashboardData).map((value, i) =>(
                    <BottomSummaryCard 
                        key ={i}
                        data= {value}
                    />
                )) : <h2>No data to display</h2>}
            </section>
        </div>
    )
}

export default UserDashboard;