import { useEffect, useState } from "react";
import { StockGroup } from "./types";  // Changed from MedicineGroup to StockGroup
import { Link } from "react-router-dom";
import DataTableComponent from "../../sharedComponents/DataTableComponent";
import { getStockGroupList } from "./apiCalls/getStockGroupList";  // Changed from getMedicineGroupList to getStockGroupList
import { useDispatch, useSelector } from "react-redux";
import { setGroupList } from "../../../../redux/groupList";
import { RootState } from "../../../../redux/store";
import { getStockListApi } from "../apiCalls/getStockListApi";

interface Column {
    name: string;
    selector?: (row: StockGroup) => React.ReactNode;  // Changed from MedicineGroup to StockGroup
    cell?: (row: StockGroup) => React.ReactNode;  // Changed from MedicineGroup to StockGroup
    sortable?: boolean;
}

const GroupList = ({ onHandleActionDetails }) => {
    const [search, setSearch] = useState('stock_name');  // Changed from group_name to stock_name
    const [searchType, setSearchType] = useState('stock_name');  // Changed from group_name to stock_name

    const dispatch = useDispatch();
    const groupList = useSelector((state: RootState) => state.groupList);
    const activeShop = useSelector((state: RootState) => state.activeShop);  // Changed from activePharmacy to activeShop

    const columns: Column[] = [
        {
            name: "Stock Name",  // Changed from Group Name to Stock Name
            selector: (row: StockGroup) => row.stock_name,  // Changed from group_name to stock_name
            sortable: true
        },
        {
            name: "No of Stock",  // Changed from No of Medicine to No of Stock
            selector: (row: StockGroup) => {  // Changed from MedicineGroup to StockGroup
                if (row.stocks.length === 1 && row.stocks[0].stock_id === null) {  // Changed from medicines to stocks and medicine_id to stock_id
                    return 0;
                }
                return row.stocks.length;  // Changed from medicines to stocks
            },
            sortable: true
        },
        {
            name: "Action",
            cell: (row: StockGroup) => <>
                <button onClick={() => onHandleActionDetails(row)}
                    disabled={row.stocks[0].stock_id === null ? true : false}  // Changed from medicines to stocks and medicine_id to stock_id
                    className={`btn p-0 px-1 btn-primary btn-sm`}  >
                    View in Detail
                </button></>,
        },
    ]

    useEffect(() => {
        const filterNull = false
        const shop_id = activeShop.shop?.shop_id;  // Changed from pharmacy_id to shop_id and pharmacy to shop
        if (shop_id) {
            const apiRes = getStockGroupList(filterNull, shop_id);  // Changed from getMedicineGroupList to getStockGroupList
            apiRes.then(data => {
                dispatch(setGroupList(data))
            })
        }
    }, [groupList.length === 0, activeShop]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearch(e.target.value);
        setSearchType(e.target.value); // Prop to set the search type in the parent component
    };

    return (
        <div className="px-md-5 pb-5">
            <div className="container-fluid" >
                {/* <Breadcrumb title={title} brad={brad} /> */}
                {/* <Link to="#" ><button type="button" className="btn btn-outline-success active btn-sm ">All</button></Link> */}
                <div className="row my-3">
                    <div className="col-12">
                        <div className="card" style={{ borderTop: "2px solid #4723d9" }}>
                            <div className="card-header d-flex justify-content-between border-bottom pb-1">
                                <h4>Stock Groups</h4>
                            </div>
                            <div className="card-body">
                                {activeShop.shop ?  
                                    <DataTableComponent search={ searchType }
                                        apidata={groupList} columns={columns} 
                                    />  :
                                    <h2>Select a shop first.</h2>
                                }           
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupList;