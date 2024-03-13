
import DataTableComponent from "../sharedComponents/DataTableComponent";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Stock, StockListProps } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { StockListApi } from "./apiCalls/getStockListApi";
import { StockList } from "../../../redux/stockList";
import Update_stock_modal from "./PopupModal"
import Edit_stock_details from "./PopupModal"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck, faCircleInfo, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { MdBrowserUpdated } from "react-icons/md";

const StockList: React.FC<StockListProps> = ({onHandleActionDetails}) =>{
    const [search, setSearch] = useState('stock_name');
    const [searchType, setSearchType] = useState('stock_name');
    const [selectData, setSelectData] = useState<Stock>()

    // open modal
    const [open_update_modal, setOpen_update_modal] = useState({ render: true, modal_open: false })
    const [open_edit_modal, setOpen_edit_modal] = useState({ render: true, modal_open: false })

    const dispatch = useDispatch();
    const stockList = useSelector((state: RootState) => state.stockList);
    const apiCall = useSelector((state: RootState) => state.callApi);
    const activeStock = useSelector((state: RootState) => state.activeStock);

    const columns = [
        {
            name: "Stock Id",
            selector: (row: Stock) => row.stock_id,
            sortable: true
        },
        {
            name: "Stock Name",
            selector: (row: Stock) => row.stock_name,
            sortable: true
        },
        {
            name: "Group Name",
            selector: (row: Stock) => row.group_name,
            sortable: true
        },
        {
            name: "Stock in Qty",
            selector: (row: Stock) => row.stock_qty,
            sortable: true
        },
        {
            name: "Action",
            cell: (row: Stock) => <>
                <button onClick={() => onHandleActionDetails(row)} className=" btn btn-info btn-sm ms-1"  >
                    <FontAwesomeIcon icon={faCircleInfo} />
                </button>
                <button onClick={() => {handleUpdateStock(row)}} className=" btn btn-primary btn-sm ms-1"  
                data-toggle="modal" data-target="#exampleModalCenter">
                    <MdBrowserUpdated  size={16}/>
                </button>
                <button onClick={() => {Stock(row)}} className=" btn btn-secondary btn-sm ms-1"  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>
            </>,
        },  
    ]

    {/* data receve from store */ }
    useEffect(() => {
        if(activeStock.stock){
            const stockList = StockListApi(activeStock.stock.stock_id);
            stockList.then(data =>{
                console.log(data);
                dispatch(StockList(data));
            })
        }
    }, [stockList.length === 0, apiCall, activeStock])

    const handleSearchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearch(e.target.value);
        setSearchType(e.target.value); // Prop to set the search type in the parent component
    }; 

    const Stock = (row: Stock) =>{
        setOpen_edit_modal({ render: !open_update_modal.render, modal_open: true })
        setSelectData(row);
    };
    
    const handleUpdateStock = (row: Stock) =>{
        setOpen_update_modal({ render: !open_update_modal.render, modal_open: true })
        setSelectData(row);
    };
    
    return(
        <div>
            <Update_stock_modal 
                select_data={selectData} open_update_data_modal={open_update_modal}
                btn_type = "update" 
            />
            <Edit_stock_details 
                select_data={selectData} open_update_data_modal={open_edit_modal}
                btn_type = "edit" 
            />
            <div className="container-fluid px-md-5" >
                <div className="row my-3">
                    <div className="col-12">
                        <div className="card" style={{ borderTop: "2px solid #4723d9" }}>
                            <div className="card-header d-flex justify-content-between border-bottom pb-1">
                                <h4>Stock List</h4>
                                <select value={search} onChange={handleSearchChange}>
                                    <option value="stock_name">Stock Name</option>
                                    <option value="group_name">Stock Group</option>
                                    <option value="stock_id">Stock Id</option>
                                </select>
                            </div>
                            <div className="card-body">
                                {activeStock.stock ? 
                                 <DataTableComponent search={ searchType }
                                      apidata={stockList} columns={columns} 
                                 />
                                :
                                <h2>Select a stock first</h2>
                                }  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StockList;