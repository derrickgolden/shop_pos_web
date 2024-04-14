import { useEffect, useRef, useState } from "react";
import ModalWrapper from "../sharedComponents/ModalWrapper";
import { PaymentDetailsProps, columnsProps } from "./types";
import { user_profile } from "../../../assets/images";
import { getCustomerInvoiceDetails } from "../apiCalls/getApiCalls";
import { InvoiceDetails } from "../apiCalls/types";
import { calcAndSetChange } from "../../controllers/calculations/calcAndSetChange";
import { payments } from "../pointOfEntry/PaymentMethod";
import { updateInvoiceDetails } from "../apiCalls/postApiCalls";

interface UpdateInvoiceProps{
    sale: columnsProps;
};
const  UpdateInvoice:React.FC<UpdateInvoiceProps> = ({sale}) =>{
    const btnClose = useRef(null);

    const [customerInvoice, setCustomerInvoice] = useState<InvoiceDetails>();
    const [pay, setPay] = useState<string>();
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetailsProps>({
        remaining: 0, change: 0.00, payment_status: "Pending", customerGave: {}
    });

    useEffect(() =>{
        const sale_id = JSON.stringify({sale_id: sale.sale_id});
        getCustomerInvoiceDetails(sale_id).then((data) =>{
            const {success, details} = data
            if(success){
                const detail = details[0];
                setCustomerInvoice(detail);
                setPaymentDetails(obj =>({customerGave: {},
                    remaining: Number(detail.balance), change: 0.00, payment_status: detail.payment_status
                }))
            }
        });
    }, [sale]);
    
    const handlePaymentInput = (e: React.ChangeEvent<HTMLInputElement> ) =>{
        if(!Object.keys(paymentDetails.customerGave).length){
            alert("Select payment method first")
            return;
        }
        const value = e.target.value;
        const total_price = Number(customerInvoice?.balance);
        const details = calcAndSetChange(Number(value), total_price);
        
        setPaymentDetails(obj =>{
            let {customerGave} = obj;
            Object.keys(customerGave).map(key =>{
                customerGave[key] = value;
            })
            return ({...details, customerGave})
        });
        setPay(value);
    }

    const handleMethodSelect = (method: string) =>{
        console.log(method)
        setPaymentDetails(obj =>({...obj, customerGave: {[method]: ""}}));
    }

    const handleUpdateInvoiceSubmit =(e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()

        console.log(paymentDetails)
        const data = JSON.stringify(paymentDetails);
        updateInvoiceDetails(data).then(data =>{
            console.log(data);
        });
    }

    return(
        <div className="transactions-popup">
        <div className="container-fruid">
            <div className="row">
                <div className="col-lg-6">
            <ModalWrapper 
                targetId='updateInvoiceModal'
                title = "Sales/Invoice Details"
                btnDetails={{
                    confirmText: "Update Invoice", 
                    confirmColor: "btn-primary", 
                    loaderColor: "#fff",
                    closeRef: btnClose
                }}
                isLoading = {false}
                submitHandle={handleUpdateInvoiceSubmit}
            >
                {
                    customerInvoice && 
                    <div className="row">
                        <div className="col-sm-5 text-center">
                            <div className="icon-area">
                                <img src={user_profile} alt="icon"/>
                                {/* <img src="assets/images/icon/transaction-details-icon.png" alt="icon"/> */}
                            </div>
                            <div className="text-area">
                                <h6>{customerInvoice.full_name}</h6>
                                <p>{new Date(customerInvoice.invoice_date || sale.sale_date).toDateString()}</p>
                                <h3>{sale.total_price}</h3>
                                <p className="com">{sale.payment_status}</p>
                            </div>
                        </div>
                        <div className="col-sm-7">
                            <div className="right-area">
                                <div className="d-flex align-items-center justify-content-between">
                                    <h5>Update Details</h5>
                                    <h6>Invoice #{customerInvoice.invoice_id}</h6>
                                </div>
                                <ul className="payment-details">
                                    <li className=" ">
                                        <p className="mb-0">Amount Paid:</p>
                                        {Object.keys(customerInvoice?.payment_details).map((key, i) =>(
                                            <p key={i} className="d-flex justify-content-between ml-2 mb-0">
                                                <span className="mdr">{key}</span>
                                                <span className="mdr">{customerInvoice.payment_details[key]} Ksh.</span>
                                            </p>
                                        ))}
                                        
                                    </li>
                                    <li>
                                        <span>Discount</span>
                                        <span>0.00 Ksh</span>
                                    </li>
                                    <li>
                                        <span>Balance</span>
                                        <span>{sale.balance}</span>
                                    </li>
                                </ul>
                                <div className="mb-3">
                                    <p>Payment Method</p>
                                    <div className="d-flex gap-4">
                                    {
                                        payments.map((payment, i) =>(
                                        <div key={i} className="form-check">
                                            <input onChange={() =>handleMethodSelect(payment.method_name)}
                                            className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" 
                                            checked ={Object.keys(paymentDetails.customerGave).includes(payment.method_name)}/>
                                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                {payment.method_name}
                                            </label>
                                        </div>
                                        ))
                                    }
                                    </div>
                                </div>
                                <ul className="list-group list-group-horizontal mb-2">
                                    <li className="list-group-item">Remaining: Ksh.{paymentDetails.remaining}</li>
                                    <li className="list-group-item">Change: Ksh.{paymentDetails.change}</li>
                                    {/* <li className="list-group-item">Status: {paymentDetails.payment_status}</li> */}
                                </ul>

                                <form className="form-floating">
                                    <input type="number" onChange={handlePaymentInput}
                                        className="form-control" id="floatingInputValue" 
                                        placeholder="name@example.com" 
                                        value={Object.values(paymentDetails.customerGave)[0] ||''} />
                                    <label htmlFor="floatingInputValue">Invoice Payment</label>
                                </form>
                            </div>
                        </div>
                    </div>
                }
                {/* </div> */}
            </ModalWrapper>
        </div>
        </div>
        </div>
        </div>
    )
};

export default UpdateInvoice;