import React, { useEffect, useState, CSSProperties } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { handleAddGroup } from "./apiCalls/handleAddGroup";
import { useNavigate } from "react-router-dom";
import { getSessionStorage } from "../../../controllers/getSessionStorage";
import Swal from "sweetalert2";

interface AddGroupFormProps{
    setShowDetails: (showDetails: string) => void;
}
const AddGroupForm: React.FC<AddGroupFormProps> = ({ setShowDetails}) =>{
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate();
    const [groupDetails, setGroupDetails] = useState({
        group_name: "", description: ""
    })
    const [selectRows, setSelectRows] = useState(3);

    const userShop = getSessionStorage();
    const { localShop } = userShop;
    // console.log(localShop);
    useEffect(() =>{
        if(localShop?.shop_name){
            setGroupDetails((obj) =>({...obj, shop_id: localShop.shop_id}))
        }else{
            Swal.fire({
                title: "Select Shop",
                text: "Select the shop you want to add the group first.",
                icon: "warning"
            });
        }
    }, []);

    const handleFormInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        const name = e.target.name;
        const value = e.target.value;     
        setGroupDetails((obj) =>({...obj, [name]: value}))
    }

    const handleAddGroupSubmit: React.FormEventHandler<HTMLFormElement> = (e) =>{
        e.preventDefault()
        setIsLoading(true);
        handleAddGroup({groupDetails, setShowDetails, setIsLoading});
    }

    return(
        <div className="px-5">
            <h3>New product group for <span className="text-warning">{localShop?.shop_name}</span></h3>
            <form onSubmit={handleAddGroupSubmit}
            className="col-sm-10"> 
                <div className="d-flex flex-wrap justify-content-between align-items-center ">
                    <div className="form-group mb-3 col-sm-5">
                        <label htmlFor="exampleFormControlInput1 p-4">Group Name</label>
                        <input onChange={handleFormInput} value={groupDetails.group_name}
                        type="text" className="form-control" id="group_name" name="group_name"
                         placeholder="Generic Product" required/>
                    </div>
                </div>  
                
                <div className="form-group mb-3 ">
                    <label htmlFor="exampleFormControlTextarea1 p-4">Description</label>
                    <textarea onChange={handleFormInput} value={groupDetails.description}
                    className="form-control" id="exampleFormControlTextarea1" required name="description"
                        aria-required rows={selectRows} ></textarea>
                </div>
                <div className="bg-white d-flex align-items-center justify-content-between " >
                    <button type="submit" disabled ={isLoading} 
                    className="btn btn-outline-danger d-flex gap-2 align-items-center">
                    <span>Submit</span>
                    <span>
                        <BeatLoader 
                            color="#dc3545"
                            loading={isLoading}
                            cssOverride={{
                                display: "flex",
                                margin: "0 auto"
                            }}
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

export default AddGroupForm;