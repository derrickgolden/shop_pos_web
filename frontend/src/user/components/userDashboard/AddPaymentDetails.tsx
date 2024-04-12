import { useRef, useState } from "react";
import { paymentDetailsFormat, paymentDetailsFormatProps } from "./paymentDeatailsFormat";
import FooterModal from "../sharedComponents/FooterModal";
import { getSessionStorage } from "../../controllers/getSessionStorage";
import { addPaymentDetails } from "../apiCalls/postApiCalls";

const AddPaymentDetails = () =>{
    const [selectedPayment, setSelectedPayment] = useState<paymentDetailsFormatProps>();
    const [paymentDetails, setPaymentDetails] = useState<{ [key: string]: string | number }>({});
    const [isLoading, setIsLoading] = useState(false);
   
    const btnClose = useRef<HTMLButtonElement>(null);

    const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedPay = (paymentDetailsFormat.filter((details => details.details.process === event.target.id)))[0];
        setSelectedPayment(selectedPay);
        let newPayDetails: { [key: string]: string | number } = {}
        selectedPay.inputs.map((pay) =>{
            newPayDetails[pay.lebal] = "";
        })
        setPaymentDetails(newPayDetails);
    };
    const handlePaymentInput = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const name = e.target.name;
        const value = e.target.value;
        setPaymentDetails(obj => ({...obj, [name]: value}));
    };
    const handlePaymentDetailsSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        // console.log(paymentDetails);
        const userShop = getSessionStorage();
        const { localShop } = userShop;
        
        if(localShop){
            const shop_id: number = localShop.shop_id;
            const payment_name = `${selectedPayment?.details.method} (${selectedPayment?.details.process})`;
            const paymentData = JSON.stringify({payment_name, paymentDetails, shop_id});
            console.log(paymentData);
            setIsLoading(true);

            addPaymentDetails(paymentData).then(data =>{
                if (btnClose.current) {
                    btnClose.current.click();
                }
                // dispatch(setCallApi(true));
            }).finally(() =>{
                setIsLoading(false);
            });
        }
    };

    return(
        <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Payment Details</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form onSubmit={handlePaymentDetailsSubmit} action="#">
                    <div className="modal-body">
                        <div>
                        {
                            paymentDetailsFormat.map((payment, i) =>{
                                return(
                                <div key={i} className="form-check">
                                    <input onChange={handlePaymentChange}
                                        className="form-check-input" type="radio" name="flexRadioDefault" id={payment.details.process}
                                        
                                    />
                                    <label className="form-check-label" htmlFor={payment.details.process}>
                                        {payment.details.method} ({payment.details.process})
                                    </label>
                                </div>
                                )
                            })
                        }
                        </div>
                        <div className="pt-4">
                        {
                            selectedPayment && 
                            selectedPayment.inputs.map((payment, i) =>
                                (
                                    <div key={i} className="form-floating mb-3">
                                        <input type={payment.type} onChange={handlePaymentInput} required
                                        value={paymentDetails[payment.lebal]} name={payment.lebal}
                                            className="form-control" id={payment.id} placeholder=""/>
                                        <label htmlFor={payment.lebal}>{payment.lebal}</label>
                                    </div>
                                )
                            )
                        }   
                        </div>
                    </div>
                    <FooterModal
                        key={"addPaymentFooterModal"}
                        btnClose={btnClose}
                        isLoading= {isLoading}
                    />
                </form>
                </div>
            </div>
        </div>
    )
};

export default AddPaymentDetails;