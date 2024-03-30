
import DataTableComponent from "../sharedComponents/DataTableComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Product } from "./types";

import Update_stock_modal from "./PopupModal"

import { MdBrowserUpdated } from "react-icons/md";

const SummaryDetails = () =>{
    const navigate = useNavigate();
    if(useLocation().state === null){
        navigate("/user/dashboard");
        return null;
    }

    const { data, caption, color } = useLocation().state;

    const [search, setSearch] = useState('product_name');
    const [searchType, setSearchType] = useState('product_name');
    const [selectData, setSelectData] = useState<Product>();
    const [isScrollable, setIsScrollable] = useState(false);
    const componentRef = useRef(null);

    // open modal
    const [open_update_modal, setOpen_update_modal] = useState({ render: true, modal_open: false });

    const columns = [
        {
            name: "Product Id",
            selector: (row: Product) => row.product_id,
            sortable: true
        },
        {
            name: "Product Name",
            selector: (row: Product) => row.product_name,
            sortable: true
        },
        {
            name: "Stock in Qty",
            selector: (row: Product) => row.containers,
            sortable: true
        },
        {
            name: "Open Stock",
            selector: (row: Product) => row.open_container_units,
            sortable: true
        },
        {
            name: "Warining Limit",
            selector: (row: Product) => row.warning_limit,
            sortable: true
        },
        {
            name: "Last Stocked",
            selector: (row: Product) => new Date(row.last_stocked).toLocaleDateString(),
            sortable: true
        },
        {
            name: "Action",
            cell: (row: Product) => <>
                {/* <button onClick={() => onHandleActionDetails(row)} className=" btn btn-info btn-sm ms-1"  >
                    <FontAwesomeIcon icon={faCircleInfo} />
                </button> */}
                <button onClick={() => {handleUpdateStock(row)}} className=" btn btn-primary btn-sm ms-1"  
                data-toggle="modal" data-target="#exampleModalCenter">
                    <MdBrowserUpdated  size={16}/>
                </button>
            </>,
        },  
    ]

    useEffect(() =>{
        if (componentRef.current) {
            const { clientHeight, scrollHeight, offsetHeight } = componentRef.current;
            setIsScrollable(scrollHeight > clientHeight || offsetHeight > clientHeight);
            // console.log(clientHeight, scrollHeight, offsetHeight)
        }
    }, [data]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearch(e.target.value);
        setSearchType(e.target.value); // Prop to set the search type in the parent component
    }; 
    
    const handleUpdateStock = (row: Product) =>{
        setOpen_update_modal({ render: !open_update_modal.render, modal_open: true })
        setSelectData(row);
    };
    
    return(
        <div className='body2 bg-white pb-5' style={{paddingTop: "4rem"}}>
            {   
                selectData && 
                    <Update_stock_modal 
                    select_data={selectData} open_update_data_modal={open_update_modal}
                    btn_type = "update" 
                />
            }
            <div ref={componentRef} className="container-fluid px-2 px-md-5" >
                <div className="pt-3 px-3 px-md-4">
                    <button type="button" onClick={() => navigate("/user/dashboard")}
                    className='btn btn-secondary'>Back to Dashboard</button>
                </div>
                <div className="row my-3">
                    <div className="col-12">
                        <div className="card" style={{ borderTop: "2px solid #4723d9" }}>
                            <div className="card-header d-flex justify-content-between border-bottom pb-1">
                                <h4 className={`${color} `}>{caption}</h4>
                                <select value={search} onChange={handleSearchChange}>
                                    <option value="product_name">Product Name</option>
                                    <option value="group_name">Product Group</option>
                                    <option value="product_id">Product Id</option>
                                </select>
                            </div>
                            <div className="card-body">
                                {
                                 <DataTableComponent search={ searchType }
                                      apidata={data} columns={columns} 
                                 />
                                }  
                            </div>
                        </div>
                    </div>
                </div>
                {
                    isScrollable && 
                    <div className="pt-2">
                        <button type="button" onClick={() => navigate("/user/dashboard")}
                        className="btn btn-secondary">Back to Dashboard</button>
                    </div>
                }
            </div>
        </div>
    )
}

export default SummaryDetails;