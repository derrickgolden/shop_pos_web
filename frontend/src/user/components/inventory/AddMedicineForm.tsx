import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { addStockApi } from "./apiCalls/addStockApi";
import { getStockGroupList } from "./stockGroup/apiCalls/getStockGroupList";
import { setGroupList } from "../../../redux/groupList";
import PricingDetailsCard from "./PricingDetailsCard";

interface AddStockFormProps{
    onHandleAddStockForm: ({}) => void;
    setShowDetails: (showDetails: string) => void
}
export interface GroupListProps{
    group_name: string;
    group_id: number;
}

const AddStockForm: React.FC<AddStockFormProps> = ({ setShowDetails}) =>{
    const groupList: GroupListProps[] = useSelector((state: RootState) => state.groupList)
    const activeShop = useSelector((state: RootState) => state.activeShop);

    const dispatch = useDispatch();

    const [stockDetails, setStockDetails] = useState({
        stock_code: '', stock_name: "", group_name: "", 
        instructions: "", side_effect: "", group_id: null
    })
    const [pricingDetails, setPricingDetails] = useState({});
    const [selectRows, setSelectRows] = useState(3)

    useEffect(() =>{
        const filterNull = false;
        if(activeShop.shop){
            const shop_id = activeShop.shop?.shop_id
            const apiRes = getStockGroupList(filterNull, shop_id);
            apiRes.then(data =>{
                if(data.length){
                    dispatch(setGroupList(data))
                }
            })       
        }
    }, [groupList.length === 0]);

    const handleFormInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>{
        const name = e.target.name;
        const value = e.target.value;
  
        setStockDetails((obj) =>({...obj, [name]: value}))
    }
    const handlePricingInput  = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> )=>{
        const name = e.target.name;
        const value = e.target.value;

        setPricingDetails((obj) =>({...obj, [name]: value}))
    }

    const handleAddStockSubmit: React.FormEventHandler<HTMLFormElement> = (e) =>{
        e.preventDefault()

        const [group] = groupList.filter(group => 
            group.group_name.trim() === stockDetails.group_name.trim()
        )

        const newStockDetails = {...stockDetails, group_id: group.group_id}

        const addStockDetails = {newStockDetails, pricingDetails};
        const shop_id = activeShop.shop?.shop_id;
        
        addStockApi({addStockDetails, setShowDetails, shop_id})
    }

    return(
        <div className="px-3 px-md-5">
            <form onSubmit={handleAddStockSubmit} encType="multipart/form-data"
            className="col-sm-10"> 
                <div className="d-flex flex-wrap justify-content-between align-items-center ">
                    <div className="form-group mb-3 col-10 col-sm-5">
                        <label htmlFor="exampleFormControlInput1">Stock Name</label>
                        <input onChange={handleFormInput} value={stockDetails.stock_name}
                        type="text" className="form-control" id="stockname" name="stock_name"
                         placeholder="Peneciline" required/>
                    </div>
                    <div className="form-group mb-3 col-10 col-sm-5">
                        <label htmlFor="exampleFormControlInput1">Stock code(optional)</label>
                        <input onChange={handleFormInput} value={stockDetails.stock_code}
                        type="text" className="form-control" id="stockid" placeholder="1576382"
                        name="stock_code" />
                    </div>
                    <div className="form-group mb-3 col-10 col-sm-5">
                        <label htmlFor="exampleFormControlSelect1">Stock Group</label>
                        <select onChange={handleFormInput} value={stockDetails.group_name}
                        className="form-control" id="exampleFormControlSelect1" name="group_name">
                            <option>-select group-</option>
                            {groupList.map((group, i)=>(
                                <option key={i} >{group.group_name}</option>
                            ))}
                        </select>
                    </div>
                    {/* <div className="form-group mb-3 col-sm-5">
                        <label htmlFor="exampleFormControlInput1">Stock Image</label>
                            <input type="file" name="logo" id="" 
                                onChange={(e) => setStockDetails(
                                (obj) =>({...obj, img_path: e.target.files[0]}))
                        } />   
                    </div> */}
                </div> 

                <PricingDetailsCard 
                    handlePricingInput={handlePricingInput} 
                    pricingDetails= {pricingDetails}
                />

                <div className="form-group mb-3 ">
                    <label htmlFor="exampleFormControlTextarea1">How to Use</label>
                    <textarea onChange={handleFormInput} value={stockDetails.instructions}
                    className="form-control" id="exampleFormControlTextarea1" required name="instructions"
                        aria-required rows={selectRows}></textarea>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="exampleFormControlTextarea1">Side Effect</label>
                    <textarea onChange={handleFormInput} value={stockDetails.side_effect}
                    className="form-control" id="exampleFormControlTextarea1" name="side_effect" required 
                        aria-required rows={selectRows}></textarea>
                </div>
                <div className="bg-white d-flex align-items-center justify-content-between " >
                    <button type="submit" className="btn btn-outline-danger">
                        Submit
                    </button>
                    <button onClick={() => setShowDetails("list")}
                        type="button" className="btn btn-primary text-white">
                            Cancel
                    </button>
                </div> 
            </form>
        </div>
    )
}

export default AddStockForm;