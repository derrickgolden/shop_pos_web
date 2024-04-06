import { useRef, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

import { countries as  countriesList} from 'countries-list'
import { CountriesData } from "../auth/types";

import { addCustomer } from "./ApiCalls/addCustomer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { setCallApi } from "../../../redux/callApi";

const countries: CountriesData = countriesList;
const AddCustomerForm = () => {
    const dispatch = useDispatch();
    const activeShop = useSelector((state: RootState) => state.activeShop);
    const [isLoading, setIsLoading] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({
        full_name:"",email:"", country: "KE", phone:"", address: "",
    });

    const btnClose = useRef<HTMLButtonElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        const name = e.target.name
        const value = e.target.value
        
        setCustomerDetails((obj) =>({...obj, [name]: value}));
    };

    const handleNewCustomerSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        
        const phone = "+" + countries[customerDetails.country].phone + customerDetails.phone
        const shop = activeShop.shop;
        
        if(shop !== null){
            const shop_id = shop.shop_id
            const customerData = {...customerDetails, shop_id, phone};
            setIsLoading(true);

            addCustomer(customerData).then(data =>{
                if (btnClose.current) {
                    btnClose.current.click();
                }
                dispatch(setCallApi(true));
            }).finally(() =>{
                setIsLoading(false);
            });
        }
    }

    return (
        <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        >
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                Add new customer
                </h5>
                <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ></button>
            </div>
            <form onSubmit={handleNewCustomerSubmit} action="#">
            <div className="modal-body">
                <div className="row">
                    <div className="col-md-6">
                    <div className="form-floating mb-3">
                        <input
                        onChange={(e) => {
                            handleInputChange(e);
                        }}
                        required
                        type="text" name="full_name"
                        className="form-control" placeholder="Full Name"
                        id="floatingInput"
                        />
                        <label htmlFor="floatingInput">Full Name/ Company Name</label>
                    </div>
                    </div>
                    <div className="form-floating col-md-6">
                        <select
                        style={{ width: "100%" }}
                        onChange={handleInputChange}
                        name="country"
                        className="form-select"
                        defaultValue="KE"
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
                </div>
                <div className="form-floating mb-3">
                    <div className="input-group">
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
                    />
                    <label htmlFor="floatingInput">Customer Email</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        onChange={handleInputChange}
                        type="text"
                        name="address"
                        className="form-control"
                        placeholder="science scope, Kimathi street"
                    />
                    <label htmlFor="floatingInput">Address</label>
                </div>
            </div>
            <div className="modal-footer">
                <button ref={btnClose}
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                >
                Close
                </button>
                <button type="submit" disabled ={isLoading} 
                    className="btn btn-primary d-flex gap-2 h-100 align-items-center">
                    <span>Add Customer</span>
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
    );
};

export default AddCustomerForm;
