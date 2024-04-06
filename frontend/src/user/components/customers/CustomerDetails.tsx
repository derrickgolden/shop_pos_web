import BeatLoader from "react-spinners/BeatLoader";

import {  useEffect, useRef, useState } from "react";
import { Customer, NewCustomerDetailsProp } from "./types";
import { useDispatch } from "react-redux";
import { setCallApi } from "../../../redux/callApi";
import { getSessionStorage } from "../../controllers/getSessionStorage";
import { editCustomerDetails } from "./ApiCalls/editCustomerDetails";

interface CustomerDetailProp{
    customerDetail: Customer
};
type CustomerKey = keyof Customer;
type NewCustomerKey = keyof NewCustomerDetailsProp;

const CustomerDetails: React.FC<CustomerDetailProp> = ({customerDetail}) =>{
    const [customerDetails, setCustomerDetails] = useState({full_name: "", email: "", address: ""});
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const btnClose = useRef<HTMLButtonElement>(null);

    useEffect(() =>{
        setCustomerDetails({
            full_name: customerDetail.full_name, email: customerDetail.email, address: customerDetail.address
        })
    },[customerDetail]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        const name = e.target.name;
        const value = e.target.value;
        setCustomerDetails((obj) =>({...obj, [name]: value}));
    };
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        
        const userShop = getSessionStorage();
        const { localShop } = userShop;
        if(localShop){
            const newDetails = {...customerDetails, shop_id: localShop.shop_id, 
                customer_id: customerDetail.customer_id, btnClose};
            setIsLoading(true);
            editCustomerDetails(newDetails).then(data =>{
                setIsLoading(false);
                dispatch(setCallApi(true));
            });
        };
    };

    return(
        <div className="modal fade" id="exampleModal1" data-bs-keyboard="false" 
        tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Customer Details</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleFormSubmit} action="">
                        <div className="modal-body">
                            <div className="container-fluid">
                                <div className="row">
                                {
                                    (["customer_id", "shop_id", "country", "phone"] as CustomerKey[]).map((key) =>{
                                        return(
                                            <div key={key} className={`mb-3 col-5 }`}>
                                                <label htmlFor={`${key}Input`} className="form-label text-capitalize">{key}</label>
                                                <input name={key} type="text" disabled className="form-control" 
                                                    id={`${key}Input`} value={customerDetail[key]} />
                                            </div>
                                        )
                                    })
                                }
                                {
                                    (["full_name", "email", "address"] as NewCustomerKey[]).map((key) =>{
                                        const value = customerDetails[key]
                                        return(
                                            <div key={key} className="mb-3">
                                                <label htmlFor={`${key}Input`} className="form-label text-capitalize">{key}</label>
                                                <input onChange={handleInputChange} name={key}
                                                    type={`${key === "email"? "email" : "text"}`} 
                                                    className="form-control" id={`${key}Input`} 
                                                    value={value} placeholder={`Add ${key}`}/>
                                            </div>
                                        )
                                    })
                                }
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button ref={btnClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                            <button type="submit" disabled ={isLoading} 
                                className="btn btn-primary d-flex gap-2 h-100 align-items-center">
                                <span>Make Changes</span>
                                    <span>
                                        <BeatLoader 
                                            color="#fff"
                                            loading={isLoading}
                                            cssOverride={{ display: "flex", margin: "0 auto" }}
                                            size={16}
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                        />
                                    </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default CustomerDetails;