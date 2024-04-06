
import { RxAvatar } from 'react-icons/rx';
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { useCustomerContext } from '../../pages/SalesEntry';

interface CustomerInvoiceProps{
    setEntryStep: React.Dispatch<React.SetStateAction<string>>;
};

const CustomerInvoice: React.FC<CustomerInvoiceProps> = ({setEntryStep}) =>{
    const { selectCustomer, setSendInvoice, sendInvoice } = useCustomerContext();
    return(
        <div className="d-none d-md-flex flex-column col-3" >
            <button onClick={() => setEntryStep("customerList")}
            className={`${selectCustomer? "btn-info" : "btn-outline-info "} btn border flex-row-1 py-3`}>
                <h5><RxAvatar /> {selectCustomer?.full_name || "Customer"}</h5>
            </button>
            <button onClick={() => setSendInvoice(!sendInvoice)}
            className={`${sendInvoice? "btn-info" : "btn-outline-info "} btn border flex-row-1 py-3`}>
                <h5><LiaFileInvoiceSolid /> Invoice</h5>
            </button>
            <div className='flex-grow-1'
            style={{backgroundColor: "#e6e9e9"}}>

            </div>
        </div>
    )
}

export default CustomerInvoice;