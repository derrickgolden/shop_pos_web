import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md"
import { Product } from "./types";
import { useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

const DetailCard: React.FC<{data: Product}> = ({data}) =>{
    const nodata = "No data"
    const [salesTotals, setSalesTotals ] = useState<{totalSales: number, totalUnits: number}>()
    const salesReport = useSelector((state: RootState) => state.salesReport);
    
    useEffect(() =>{
        let totalSales = 0;
        let totalUnits = 0
        salesReport.map((sales) =>{
            sales.sales_items.map((details) =>{
                if( details.product_id === data.product_id ){
                    totalSales += details.sub_total;
                    totalUnits += details.units_sold
                }
            })
        })
        setSalesTotals({totalSales, totalUnits})
    }, [data])
    return(
        <div>
            <div className="d-md-flex justify-content-between ">
                <div className="card border-secondary mb-5 col-md-5" >
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <p className="text-poppins-semibold mb-0">Product</p>
                    </div>

                    <div className="d-flex justify-content-between card-body text-dark ">
                        <div className="col-6 text-left">
                            <h5 className="card-title text-poppins-bold">{data.product_name}</h5>
                            <p className="card-text text-poppins">
                                Product name
                            </p>
                        </div>
                        <div className="col-6 text-left">
                            <h5 className="card-title text-poppins-bold">
                                {data.group_name}
                            </h5>
                            <p className="card-text text-poppins">Product Group</p>
                        </div>
                    </div>
                </div>
                <div className="card border-secondary mb-5 col-md-5" >
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <p className="text-poppins-semibold mb-0">Inventory in Qty</p>
                        <a className="text-poppins-regular" href="#">
                                Send Stock Request <MdOutlineKeyboardDoubleArrowRight />
                        </a>
                    </div>

                    <div className="d-flex justify-content-between card-body text-dark ">
                        <div className="col-3 text-left">
                            <h5 className="card-title text-poppins-bold">
                                {salesTotals?.totalUnits || nodata}    
                            </h5>
                            <p className="card-text text-poppins">
                                Lifetime Unit Sales
                            </p>
                        </div>
                        <div className="col-3 text-left">
                            <h5 className="card-title text-poppins-bold">
                                {salesTotals?.totalSales || nodata}
                            </h5>
                            <p className="card-text text-poppins">Lifetime Sales(Ksh)</p>
                        </div>
                        <div className="col-3 text-left">
                            <h5 className="card-title text-poppins-bold">
                                {data.stock_qty || nodata}
                            </h5>
                            <p className="card-text text-poppins">Stock Left</p>
                        </div>
                    </div>
                </div>
            </div>
            {data.instructions && 
                <div className="card border-secondary mb-5 " >
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <p className="text-poppins-semibold mb-0">Information</p>
                    </div>

                    <div className="d-flex justify-content-between card-body text-dark ">
                        
                        <div className="col-12 text-left">
                            <p className="card-text text-poppins">{data.instructions}</p>
                        </div>
                        
                    </div>
                </div>
            }
        </div>
    )
}

 export default DetailCard;