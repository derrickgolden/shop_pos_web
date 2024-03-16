import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductGroupList } from "./apiCalls/getProductGroupList";
import { useDispatch, useSelector } from "react-redux";
import { Group, setGroupList } from "../../../../redux/groupList";
import { RootState } from "../../../../redux/store";
import DataTableProductGroup from "../../sharedComponents/DataTableProductGroup";

interface  GroupListProps{
    onHandleActionDetails: (row: Group) => void
  }

const GroupList: React.FC<GroupListProps> = ({onHandleActionDetails}) =>{
    const [search, setSearch] = useState('group_name');
    const [searchType, setSearchType] = useState('group_name');
    
    const dispatch = useDispatch();
    const groupList = useSelector((state: RootState) => state.groupList);
    const activeShop = useSelector((state: RootState) => state.activeShop);

    const columns = [
        {
            name: "Group Name",
            selector: (row: Group) => row.group_name,
            sortable: true
        },
        {
            name: "No of Product",
            selector: (row: Group) => {
                if(row.products.length === 1 && row.products[0].product_id === null){
                    return 0;
                }
                return row.products.length;
            },
            sortable: true
        },
        {
            name: "Action",
            cell: (row: Group) => <>
            <button onClick={() => onHandleActionDetails(row)} 
                disabled= {row.products[0].product_id === null ? true : false}
                className={`btn p-0 px-1 btn-primary btn-sm`}  >
                    View in Detail
                </button></>,
        },
    ]

    useEffect(() =>{
        const filterNull = false
        const shop_id = activeShop.shop?.shop_id;
        if(shop_id){
            const apiRes = getProductGroupList(filterNull, shop_id);
            apiRes.then(data =>{
                dispatch(setGroupList(data))
            })   
        }
    }, [groupList.length === 0, activeShop]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearch(e.target.value);
        setSearchType(e.target.value); // Prop to set the search type in the parent component
      };

    return(
        <div className="px-md-5 pb-5">
            <div className="container-fluid" >
                {/* <Breadcrumb title={title} brad={brad} /> */}
                <Link to="#" ><button type="button" className="btn btn-outline-success active btn-sm ">All</button></Link>
                <div className="row my-3">
                    <div className="col-12">
                        <div className="card" style={{ borderTop: "2px solid #4723d9" }}>
                            <div className="card-header d-flex justify-content-between border-bottom pb-1">
                                <h4>Product Groups</h4>
                                {/* <select value={search} onChange={handleSearchChange}>
                                    <option value="product_name">Product Name</option>
                                    <option value="group_name">Product Group</option>
                                    <option value="product_id">Product Id</option>
                                </select> */}
                            </div>
                            <div className="card-body">
                                {activeShop.shop ?  
                                    <DataTableProductGroup search={ searchType }
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