import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useEffect } from "react";
import { getSalesReportApi } from "../../pages/apiCalls/getSalesReport";
import { setSalesReportList } from "../../../redux/salesReport";
import { calcProfits } from "../../pages/calculations/calcProfits";

const ProfitCard = () =>{
    const dispatch = useDispatch()
    const sales = useSelector((state: RootState) => state.salesReport)
    const activeShop = useSelector((state: RootState) => state.activeShop); 

    // useEffect(() =>{
    //     if(activeShop.shop && sales.length <= 0){
    //         console.log(sales)
    //         const url = "sales/get-sales";
    //         const shop_id = activeShop.shop.shop_id;
    //         const salesReport = getSalesReportApi({url, shop_id});
    //         salesReport.then((data) =>{
    //             const { success, details } = data;
    //             if(success){
    //                 dispatch(setSalesReportList(details));
    //             }
    //         });
    //     };
    // }, [sales.length === 0, activeShop]);


    const profits = calcProfits(sales)

    return(
        <section className="lower-section bg-white d-flex flex-row flex-wrap justify-content-around mb-5">
            {
                profits.map((profit, i) =>(
                    <div key={i} className={`mb-4 card col-5 col-lg-2 text-center card 
                        shadow p-4  ${profit.bg_color}`}
                    >
                        <div >
                            <div className="card-content clearfix">
                                <p className="card-stats-title right card-title  wdt-lable">{profit.lebal}</p>
                                <h4 className="right panel-middle margin-b-0 wdt-lable">Ksh.{profit.profit}</h4>
                            </div>

                        </div>
                    </div>
                ))
            }
        </section>
    )
}

export default ProfitCard;