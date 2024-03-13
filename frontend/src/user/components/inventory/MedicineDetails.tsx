import { useDispatch } from "react-redux";
import DetailCard from "./DetailCard"
import { StockApi } from "./apiCalls/deleteStockApi";
import { StockDetailsProps } from "./types";
import { setCallApi } from "../../../redux/callApi";
import Swal from "sweetalert2";

const StockDetails: React.FC<StockDetailsProps> = ({onHandleActionDetails, stockDetails, setShowDetails}) =>{
    // console.log(stockDetails);
    const dispatch = useDispatch();

    const StockDelete = (stock_id: number, stock_name: string) =>{
        Swal.fire({
            title: `Are you sure you want to delete ${stock_name}?`,
            text: `All data will be lost including sales history related to the stock.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete!"
        }).then((result) => {
            if (result.isConfirmed) {
                StockApi({setShowDetails, stock_id}).then((data) =>{
                    dispatch(setCallApi(true));
                });
            }
        });
    }
    
    return(
        <div className="px-2 px-md-5">
            {<DetailCard 
                key={1}
                data ={stockDetails}/>}
            <div className="bg-white d-flex gap-4 align-items-center justify-content-between" >
                <button type="button" 
                onClick={() => StockDelete(stockDetails?.stock_id, stockDetails.stock_name)}
                className="btn btn-outline-danger">Delete Item</button>
                <button onClick={() => setShowDetails("list")}
                    type="button" className="btn btn-primary text-white">
                        Back to Stock List
                </button>
            </div> 
        </div>
    )
}

export default StockDetails