import { useRef, useState } from "react";

import { countries as  countriesList} from 'countries-list'
import { CountriesData } from "../auth/types";

import { useDispatch } from "react-redux";
import { setCallApi } from "../../../redux/callApi";
import { getSessionStorage } from "../../controllers/getSessionStorage";
import FooterModal from "../sharedComponents/FooterModal";
import { addCustomer } from "../apiCalls/postApiCalls";

const countries: CountriesData = countriesList;
const AddCustomerForm = () => {
    const dispatch = useDispatch();
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
        
        const phone = "+" + countries[customerDetails.country].phone + customerDetails.phone;
        const userShop = getSessionStorage();
        const { localShop } = userShop;
        
        if(localShop){
            const shop_id = localShop.shop_id
            const customerData = JSON.stringify({...customerDetails, shop_id, phone});
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
        <div className="modal fade" id="exampleModal" tabIndex={-1}
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
                <FooterModal
                    key={"footerModal"}
                    btnClose={btnClose}
                    isLoading= {isLoading}
                />
            </form>
            </div>
        </div>
        </div>
    );
};

export default AddCustomerForm;
