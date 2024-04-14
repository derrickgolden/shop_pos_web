import { useRef, useState } from "react";

import { countries as  countriesList} from 'countries-list'
import { CountriesData } from "../auth/types";

import { useDispatch } from "react-redux";
import { setCallApi } from "../../../redux/callApi";
import { getSessionStorage } from "../../controllers/getSessionStorage";
import FooterModal from "../sharedComponents/FooterModal";
import { addCustomer } from "../apiCalls/postApiCalls";
import ModalWrapper from "../sharedComponents/ModalWrapper";
import UpdateInvoice from "../reports/UpdateInvoice";

const countries: CountriesData = countriesList;
const AddCustomerForm = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({
        full_name:"",email:"", country: "KE", phone:"", address: "",
    });

    const btnClose = useRef<HTMLButtonElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        const name = e.target.name;
        const value = e.target.value;
        
        setCustomerDetails((obj) =>({...obj, [name]: value}));
    };

    const handleNewCustomerSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        
        const phone = "+" + countries[customerDetails.country].phone + customerDetails.phone;
        const userShop = getSessionStorage();
        const { localShop } = userShop;
        
        if(localShop){
            const shop_id = localShop.shop_id
            const customerData = JSON.stringify({...customerDetails, shop_id, phone});
            setIsLoading(true);

            addCustomer(customerData).then(data =>{
                setCustomerDetails({
                    full_name:"",email:"", country: "KE", phone:"", address: "",
                });
                if (btnClose.current) {
                    btnClose.current.click();
                }
                dispatch(setCallApi(true));
            }).finally(() =>{
                setIsLoading(false);
            });
        };
    };

    return (
        <ModalWrapper 
            targetId='addCustomerModal'
            title = "New Customer/Company Details"
            btnDetails={{
                confirmText: "Add Customer", 
                confirmColor: "btn-primary", 
                loaderColor: "#fff",
                closeRef: btnClose
            }}
            isLoading = {isLoading}
            submitHandle={handleNewCustomerSubmit}
        >
            <div className="modal-body">
                <div className="form-floating mb-3">
                    <input onChange={(e) => {handleInputChange(e) }}
                        required type="text" name="full_name" value={customerDetails.full_name}
                        className="form-control" placeholder="Full Name" id="floatingInput"
                    />
                    <label htmlFor="floatingInput">Full Name/ Company Name
                        <span className="text-danger">*</span>
                    </label>
                </div>
                <div className="d-md-flex flex-wrap justify-content-between">
                    <div className="form-floating mb-3 col-12 col-md-5">
                             <select
                             style={{ width: "100%" }}
                             onChange={handleInputChange}
                             name="country"
                             className="form-select"
                             value={customerDetails.country}
                             id="floatingCountry"
                             >
                             <option value="1">Select Your Country</option>
                             {Object.keys(countries).map((code, i) => (
                                 <option key={code} value={code}>
                                 {countries[code].name}
                                 </option>
                             ))}
                             </select>
                             <label className="ml-2" htmlFor="floatingCountry">Country</label>
                    </div>
                    <div className="form-floating mb-3 col-12 col-md-6">
                         <input
                             onChange={handleInputChange}
                             type="text"
                             name="address"
                             className="form-control"
                             placeholder="science scope, Kimathi street"
                             value={customerDetails.address}
                         />
                         <label htmlFor="floatingInput">Address</label>
                     </div>
                </div>
                <div className="form-floating mb-3">
                    <div className="input-group input-group-lg">
                         <span className="input-group-text">
                             +{countries[customerDetails.country].phone}
                         </span>
                         <input
                             onChange={handleInputChange}
                             required
                             type="tel"
                             name="phone"
                             className="form-control"
                             pattern="[0-9]{9}"
                             placeholder="734567890"
                             value={customerDetails.phone}
                         />
                    </div>
                </div>
                <div className="form-floating mb-3">
                    <input
                         onChange={handleInputChange}
                         type="email"
                         name="email"
                         className="form-control"
                         placeholder="customer@gmail.com"
                         value={customerDetails.email}
                    />
                    <label htmlFor="floatingInput">Customer Email</label>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default AddCustomerForm;
