import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { addProductApi } from "./apiCalls/addProductApi";
import { getProductGroupList } from "./productGroup/apiCalls/getProductGroupList";
import { setGroupList } from "../../../redux/groupList";
import PricingDetailsCard from "./PricingDetailsCard";
import Swal from "sweetalert2";

interface AddProductFormProps{
    setShowDetails: (showDetails: string) => void
}

const AddProductForm: React.FC<AddProductFormProps> = ({ setShowDetails}) =>{
    const groupList = useSelector((state: RootState) => state.groupList)
    const activeShop = useSelector((state: RootState) => state.activeShop);

    const dispatch = useDispatch();

    const [productDetails, setProductDetails] = useState({
        product_code: '', product_name: "", group_name: "", 
        instructions: "", side_effect: "", group_id: null, img_path: null
    })
    const [pricingDetails, setPricingDetails] = useState({price: 0, package_cost: 0, package_size: 0});
    const [selectRows, setSelectRows] = useState(3);

    useEffect(() =>{
        const filterNull = false;
        if(activeShop.shop){
            const shop_id = activeShop.shop?.shop_id
            const apiRes = getProductGroupList(filterNull, shop_id);
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
  
        setProductDetails((obj) =>({...obj, [name]: value}))
    }
    const handlePricingInput  = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> )=>{
        const name = e.target.name;
        const value = e.target.value;

        setPricingDetails((obj) =>({...obj, [name]: value}))
        console.log(pricingDetails)
    }

    const handleAddProductSubmit: React.FormEventHandler<HTMLFormElement> = (e) =>{
        e.preventDefault()

        const [group] = groupList.filter(group => 
            group.group_name.trim() === productDetails.group_name.trim()
        )
        if(!group){
            Swal.fire({
                title: "Select a group or add new one first."
            })
        }else{
            const newProductDetails = {...productDetails, group_id: group.group_id}
    
            const {price} = pricingDetails
            const addProductDetails = {newProductDetails, pricingDetails};
            const shop_id = activeShop.shop?.shop_id;
            
            if(price && shop_id){
                addProductApi({addProductDetails, setShowDetails, shop_id})
            }
        }
    }

    return(
        <div className="px-3 px-md-5">
            <form onSubmit={handleAddProductSubmit} encType="multipart/form-data"
            className="col-sm-10"> 
                <div className="d-flex flex-wrap justify-content-between align-items-center ">
                    <div className="form-group mb-3 col-10 col-sm-5">
                        <label htmlFor="exampleFormControlInput1">Product Name</label>
                        <input onChange={handleFormInput} value={productDetails.product_name}
                        type="text" className="form-control" id="productname" name="product_name"
                         placeholder="Peneciline" required/>
                    </div>
                    <div className="form-group mb-3 col-10 col-sm-5">
                        <label htmlFor="exampleFormControlInput1">Product code(optional)</label>
                        <input onChange={handleFormInput} value={productDetails.product_code}
                        type="text" className="form-control" id="productid" placeholder="1576382"
                        name="product_code" />
                    </div>
                    <div className="form-group mb-3 col-10 col-sm-5">
                        <label htmlFor="exampleFormControlSelect1">Product Group</label>
                        <select onChange={handleFormInput} value={productDetails.group_name}
                        className="form-control" id="exampleFormControlSelect1" name="group_name" required >
                            <option>-select group-</option>
                            {groupList.map((group, i)=>(
                                <option key={i} >{group.group_name}</option>
                            ))}
                        </select>
                    </div>
                    {/* <div className="form-group mb-3 col-sm-5">
                        <label htmlFor="exampleFormControlInput1">Product Image</label>
                            <input type="file" name="logo" id="" 
                                onChange={(e) => setProductDetails(
                                (obj) =>({...obj, img_path: e.target.files[0]}))
                        } />   
                    </div> */}
                </div> 

                <PricingDetailsCard 
                    handlePricingInput={handlePricingInput} 
                    pricingDetails= {pricingDetails}
                />

                <div className="form-group mb-3 ">
                    <label htmlFor="exampleFormControlTextarea1">Instructions</label>
                    <textarea onChange={handleFormInput} value={productDetails.instructions}
                    className="form-control" id="exampleFormControlTextarea1" required name="instructions"
                        aria-required rows={selectRows}></textarea>
                </div>
                {/* <div className="form-group mb-3">
                    <label htmlFor="exampleFormControlTextarea1">Side Effect</label>
                    <textarea onChange={handleFormInput} value={productDetails.side_effect}
                    className="form-control" id="exampleFormControlTextarea1" name="side_effect" required 
                        aria-required rows={selectRows}></textarea>
                </div> */}
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

export default AddProductForm;