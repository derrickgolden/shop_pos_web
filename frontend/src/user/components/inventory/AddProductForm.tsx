import React, { useEffect, useState, CSSProperties } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { addProductApi } from "./apiCalls/addProductApi";
import { getProductGroupList } from "./productGroup/apiCalls/getProductGroupList";
import { setGroupList } from "../../../redux/groupList";
import PricingDetailsCard from "./PricingDetailsCard";
import Swal from "sweetalert2";
import { NewProductDetailsProps } from "./types";

interface AddProductFormProps{
    setShowDetails: (showDetails: string) => void
}

const AddProductForm: React.FC<AddProductFormProps> = ({ setShowDetails}) =>{
    const [isLoading, setIsLoading] = useState(false)
    const groupList = useSelector((state: RootState) => state.groupList)
    const activeShop = useSelector((state: RootState) => state.activeShop);

    const dispatch = useDispatch();

    const [productDetails, setProductDetails] = useState<NewProductDetailsProps>({
        product_code: '', product_name: "", group_name: "", 
        instructions: "", side_effect: "", group_id: 0, img_path: null
    })
    const [pricingDetails, setPricingDetails] = useState({price: '', package_cost: '', package_size: ''});
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
    }
    const handleImageInput  = (e: React.ChangeEvent<HTMLInputElement> )=>{
        const value = e.target.files;
        if(value){
            setProductDetails((obj) =>({...obj, img_path: value[0]}));
        }else{
            setProductDetails((obj) =>({...obj, img_path: null}));
        }
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
                setIsLoading(true);
                addProductApi({addProductDetails, setShowDetails, setIsLoading, shop_id})
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
                    <div className="form-group mb-3 col-sm-5">
                        <label htmlFor="exampleFormControlInput1">Product Image</label> <br />
                            <input type="file" name="logo" id="" 
                                onChange={ handleImageInput } 
                            />   
                    </div>
                </div> 

                <PricingDetailsCard 
                    handlePricingInput={handlePricingInput} 
                    pricingDetails= {pricingDetails}
                />

                <div className="form-group mb-3 ">
                    <label htmlFor="exampleFormControlTextarea1">Information(optional)</label>
                    <textarea onChange={handleFormInput} value={productDetails.instructions}
                    className="form-control" id="exampleFormControlTextarea1" name="instructions"
                        aria-required rows={selectRows}></textarea>
                </div>
                {/* <div className="form-group mb-3">
                    <label htmlFor="exampleFormControlTextarea1">Side Effect</label>
                    <textarea onChange={handleFormInput} value={productDetails.side_effect}
                    className="form-control" id="exampleFormControlTextarea1" name="side_effect" required 
                        aria-required rows={selectRows}></textarea>
                </div> */}
                <div className="bg-white d-flex align-items-center justify-content-between " >
                    <button type="submit" disabled ={isLoading} 
                    className="btn btn-outline-danger d-flex gap-2 h-100 align-items-center">
                        <span>Submit</span>
                        <span>
                            <BeatLoader 
                                color="#dc3545"
                                loading={isLoading}
                                cssOverride={{ display: "flex", margin: "0 auto" }}
                                size={16}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        </span>
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