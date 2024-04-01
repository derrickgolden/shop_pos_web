import React, { useState } from "react";
import { useDispatch,  } from "react-redux";
import { useNavigate } from "react-router-dom";
import { regiterShopApi, shopDetails } from "./apiCalls/registerShopApi";

const inputDetails: {
    label: string;
    type: string;
    placeholder: string;
    name: "shop_name" | "location" | "shop_email" | "shop_tel";
}[] = [
    {label: "Shop Name", type: "text", placeholder: "Shop name", name: "shop_name"},
    {label: "Location", type: "text", placeholder: "Westlands Nairobi", name: "location"},
    {label: "Shop Email", type: "email", placeholder: "shop@gmail.com", name: "shop_email"},
    {label: "Shop Tel", type: "text", placeholder: "+2547147000000", name: "shop_tel"},
]

const RegisterShop: React.FC = () =>{
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [shopDetails, setShopDetails] = useState<shopDetails>({
        shop_name: "", location: "", shop_email: "", shop_tel: "", extra_info: "", logo: null
    })
    const [selectRows, setSelectRows] = useState(3)

    const handleFormInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>{
        const name = e.target.name;
        const value = e.target.value;
    
        setShopDetails((obj) =>({...obj, [name]: value}))
    }

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const value = e.target.files;
        if(value){
            setShopDetails((obj) =>({...obj, logo: value[0]}))
        }else{
            setShopDetails((obj) =>({...obj, logo: null}))
        }
    }

    const handleRegShopSubmit: React.FormEventHandler<HTMLFormElement> = (e) =>{
        e.preventDefault()
        
        regiterShopApi({shopDetails, navigate})
    }

    return(
        <div className='body2 bg-light' style={{paddingTop: "2rem"}}>
            <section className="upper-section  py-5 fullscreen" >
                <div className="px-5">
                    <form onSubmit={handleRegShopSubmit} encType="multipart/form-data"
                    className="col-sm-10"> 
                        <div className="d-flex flex-wrap justify-content-between align-items-center ">
                            {
                                inputDetails.map((detail, i) =>{
                                    const {label, name, type, placeholder} = detail;
                                    return(
                                    <div key={i}
                                    className="form-group mb-3 col-sm-5">
                                        <label htmlFor="exampleFormControlInput1">{label}</label>
                                        <input onChange={handleFormInput} 
                                            value={shopDetails[name] }
                                            type={type} className="form-control" id="productname"
                                            name={name} placeholder={placeholder} required/>
                                    </div>
                                )})
                            }
                                    <div className="form-group mb-3 col-sm-5">
                                        <label htmlFor="exampleFormControlInput1">Upload your logo</label>
                                        <input type="file" name="logo" id="" 
                                            onChange={handleLogoUpload}
                                         />   
                                    </div>
                        </div> 
                        <div className="form-group mb-3 ">
                            <label htmlFor="exampleFormControlTextarea1">Any Etra Info</label>
                            <textarea onChange={handleFormInput} value={shopDetails.extra_info}
                                className="form-control" id="exampleFormControlTextarea1" required name="extra_info"
                                aria-required rows={selectRows}>
                                
                            </textarea>
                        </div>
                        <div className="d-flex align-items-center justify-content-between " >
                            <button type="submit" className="btn btn-outline-danger">
                                Submit
                            </button>
                            <button onClick={() => navigate(-1)}
                            type="button" className="btn btn-primary text-white">
                                Cancel
                            </button>
                        </div> 
                    </form>
                </div>
            </section>
        </div>
    )
}

export default RegisterShop;