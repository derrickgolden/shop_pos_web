
import {  useEffect, useRef, useState } from "react";
import { Customer, NewCustomerDetailsProp } from "./types";
import { useDispatch } from "react-redux";
import { setCallApi } from "../../../redux/callApi";
import { getSessionStorage } from "../../controllers/getSessionStorage";
import { editCustomerDetails } from "./ApiCalls/editCustomerDetails";
import ModalWrapper from "../sharedComponents/ModalWrapper";

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
    const handleCustomerEditSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
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
        <ModalWrapper
            targetId='customerDetailsModal'
            title = "Customer Details"
            btnDetails={{
                confirmText: "Edit Deatils", 
                confirmColor: "btn-primary", 
                loaderColor: "#fff",
                closeRef: btnClose
            }}
            isLoading = {isLoading}
            submitHandle = {handleCustomerEditSubmit}
        >
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
        </ModalWrapper>
    )
};

export default CustomerDetails;