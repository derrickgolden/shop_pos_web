import { useEffect, useState } from "react";
import CustomerListNavbar from "../components/customers/CustomerListNavbar";
import CustomerDataTable from "../components/customers/CustomerDataTable";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getCustomerListApi } from "../components/customers/ApiCalls/getCustomerList";
import { Customer } from "../components/customers/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { ImCheckboxUnchecked } from "react-icons/im";
import { FaCheckSquare } from "react-icons/fa";
import CustomerDetails from "../components/customers/CustomerDetails";
import { getSessionStorage } from "../controllers/getSessionStorage";
import { EntryStepTypes } from "../pages/types";

interface CustomerListProps{
    setEntryStep: React.Dispatch<React.SetStateAction<EntryStepTypes>>;
    selectCustomer: Customer | undefined;
    setSelectCustomer: React.Dispatch<React.SetStateAction<Customer | undefined>>;
}
const CustomerList: React.FC<CustomerListProps> = ({setEntryStep, selectCustomer, setSelectCustomer}) =>{
    const callApi = useSelector((state: RootState) => state.callApi);
    const [customerList, setCustomerList] = useState([]);
    const [customerDetail, setCustomerDetail] = useState<Customer>();
    const [search, setSearch] = useState('full_name');
    const [searchType, setSearchType] = useState('full_name');

    const userShop = getSessionStorage();
    const { localShop } = userShop;
    useEffect(() =>{
        const shop_id = localShop?.shop_id
        if(shop_id){
            getCustomerListApi(shop_id).then(data =>{
                setCustomerList(data);
            });
        }
    }, [callApi]);

    const columns = [
        {
            name: "Customer Id",
            selector: (row: Customer) => row.customer_id,
            sortable: true
        },
        {
            name: "Name",
            selector: (row: Customer) => row.full_name,
            sortable: true
        },
        {
            name: "Phone Number",
            selector: (row: Customer) => row.phone,
            sortable: true
        },
        {
            name: "Email",
            selector: (row: Customer) => row.email,
            sortable: true
        },
        {
            name: "Action",
            cell: (row: Customer) => <>
                <button onClick={() => handleShowDetails(row)} data-bs-toggle="modal" data-bs-target="#customerDetailsModal"
                className=" btn btn-info btn-sm ms-1"  >
                    <FontAwesomeIcon icon={faCircleInfo} />
                </button>
                <button onClick={() => handleSelectCustomer(row)} 
                className=" btn btn-warning btn-lg px-1 py-0 ms-1"  >
                    {
                        selectCustomer?.customer_id === row.customer_id ? 
                        <FaCheckSquare /> : <ImCheckboxUnchecked />
                    }
                </button>
            </>,
        },  
    ]

    const handleShowDetails = (row: Customer) =>{
        setCustomerDetail(row);
    }
    const handleSelectCustomer = (row: Customer) =>{
        setSelectCustomer(customer =>{
            if(customer?.customer_id === row.customer_id){
                return undefined
            };
            setEntryStep(obj => ({...obj, current: obj.prev}));;
            return row;
        });
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearch(e.target.value);
        setSearchType(e.target.value); // Prop to set the search type in the parent component
    };
    return (
        <div>
            <CustomerListNavbar 
                setEntryStep = {setEntryStep} 
            />
            {
                customerDetail && 
                <CustomerDetails 
                    customerDetail = {customerDetail}
                />
            }
            <div className="container-fluid px-md-5" >
                <div className="row my-3">
                    <div className="col-12">
                        <div className="card" style={{ borderTop: "2px solid #4723d9" }}>
                            <div className="card-header d-flex justify-content-between border-bottom pb-1">
                                <h4>Customer List</h4>
                                <select value={search} onChange={handleSearchChange}>
                                    <option value="full_name">Customer Name</option>
                                    <option value="phone">Phone No.</option>
                                    <option value="email">Email</option>
                                    <option value="customer_id">Customer Id</option>
                                </select>
                            </div>
                            <div className="card-body">
                                {localShop ? 
                                 <CustomerDataTable search={ searchType }
                                      apidata={customerList} columns={columns} 
                                 />
                                :
                                <h2>Select a shop first</h2>
                                }  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default CustomerList;