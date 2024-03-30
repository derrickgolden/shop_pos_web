
import DataTableComponent from "../sharedComponents/DataTableComponent";
import { useEffect, useState } from "react";
import { Product, ProductListProps } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { getProductListApi } from "./apiCalls/getProductListApi";
import { setProductList } from "../../../redux/productList";
import Update_stock_modal from "./PopupModal"
import Edit_product_details from "./PopupModal"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { MdBrowserUpdated } from "react-icons/md";

const ProductList: React.FC<ProductListProps> = ({onHandleActionDetails}) =>{
    const [search, setSearch] = useState('product_name');
    const [searchType, setSearchType] = useState('product_name');
    const [selectData, setSelectData] = useState<Product>()

    // open modal
    const [open_update_modal, setOpen_update_modal] = useState({ render: true, modal_open: false })
    const [open_edit_modal, setOpen_edit_modal] = useState({ render: true, modal_open: false })

    const dispatch = useDispatch();
    const productList = useSelector((state: RootState) => state.productList);
    const apiCall = useSelector((state: RootState) => state.callApi);
    const activeShop = useSelector((state: RootState) => state.activeShop);

    const columns = [
        {
            name: "Product Id",
            selector: (row: Product) => row.product_id,
            sortable: true
        },
        {
            name: "Group Name",
            selector: (row: Product) => row.group_name,
            sortable: true
        },
        {
            name: "Product Name",
            selector: (row: Product) => row.product_name,
            sortable: true
        },
        {
            name: "Closed Stock",
            selector: (row: Product) => row.stock_qty | 0,
            sortable: true
        },
        {
            name: "Open Stock",
            selector: (row: Product) => row.open_container_units | 0,
            sortable: true
        },
        {
            name: "Action",
            cell: (row: Product) => <>
                <button onClick={() => onHandleActionDetails(row)} className=" btn btn-info btn-sm ms-1"  >
                    <FontAwesomeIcon icon={faCircleInfo} />
                </button>
                <button onClick={() => {handleUpdateStock(row)}} className=" btn btn-primary btn-sm ms-1"  
                data-toggle="modal" data-target="#exampleModalCenter">
                    <MdBrowserUpdated  size={16}/>
                </button>
                <button onClick={() => {handleEditProduct(row)}} className=" btn btn-secondary btn-sm ms-1"  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>
            </>,
        },  
    ]

    {/* data receve from store */ }
    useEffect(() => {
        if(activeShop.shop){
            const productList = getProductListApi(activeShop.shop.shop_id);
            productList.then(data =>{
                dispatch(setProductList(data));
            })
        }
    }, [productList.length === 0, apiCall, activeShop])

    const handleSearchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearch(e.target.value);
        setSearchType(e.target.value); // Prop to set the search type in the parent component
    }; 

    const handleEditProduct = (row: Product) =>{
        setOpen_edit_modal({ render: !open_update_modal.render, modal_open: true })
        setSelectData(row);
    };
    
    const handleUpdateStock = (row: Product) =>{
        setOpen_update_modal({ render: !open_update_modal.render, modal_open: true })
        setSelectData(row);
    };
    
    return(
        <div>
            {
                selectData && (
                    <>
                    <Update_stock_modal 
                        select_data={selectData} open_update_data_modal={open_update_modal}
                        btn_type = "update" 
                    />
                    <Edit_product_details 
                        select_data={selectData} open_update_data_modal={open_edit_modal}
                        btn_type = "edit" 
                    />
                    </>
                )
            }
            <div className="container-fluid px-md-5" >
                <div className="row my-3">
                    <div className="col-12">
                        <div className="card" style={{ borderTop: "2px solid #4723d9" }}>
                            <div className="card-header d-flex justify-content-between border-bottom pb-1">
                                <h4>Product List</h4>
                                <select value={search} onChange={handleSearchChange}>
                                    <option value="product_name">Product Name</option>
                                    <option value="group_name">Product Group</option>
                                    <option value="product_id">Product Id</option>
                                </select>
                            </div>
                            <div className="card-body">
                                {activeShop.shop ? 
                                 <DataTableComponent search={ searchType }
                                      apidata={productList} columns={columns} 
                                 />
                                :
                                <h2>Select a shop first</h2>
                                }  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductList;