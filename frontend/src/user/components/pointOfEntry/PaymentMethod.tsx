
import React, { useState } from "react";
import { BsCashCoin } from "react-icons/bs";
import { FaAngleRight, FaRegCreditCard } from "react-icons/fa";
import { MdCancel, MdOutlinePhoneAndroid } from "react-icons/md";
import { calcAndSetChange } from "../../controllers/calculations/calcAndSetChange";
import Swal from "sweetalert2";
import ChangeDisplay from "./ChangeDisplay";
import { PaymentMethodProps } from "./types";
import { useCustomerContext } from "../../pages/createContext";

export const payments = [
    {icon:<BsCashCoin size={24}/>, method_name: "Cash", method: "cash", payment_method_id: 1},
    {icon:<FaRegCreditCard size={24}/>, method_name: "Bank", method: "bank", payment_method_id: 3},
    {icon:<MdOutlinePhoneAndroid size={24}/>, method_name: "Mpesa", method: "mpesa", payment_method_id: 4},
    // {icon:<MdAccountBalanceWallet size={24}/>, method_name: "Customer Account", method: "customer_acc", payment_method_id: 2},
]

interface PaymentProps{
    icon: JSX.Element;
    method_name: string;
    method: string;
    payment_method_id: number;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ handleVilidateClick,  
    totalPrice, activePayMethod, customerGave, paymentDetails, setCustomeGave, 
    setActivePayMethod, setPaymentDetails, PaymentCalcHandles, setBtnClicks }) =>{

        const { sendInvoice } = useCustomerContext();
        const [ isValidateEnabled, setIsvalidateEnabled ] = useState(true)
        const currentWidth = window.innerWidth;
        const isDisableBtn = sendInvoice && isValidateEnabled || 
                        !paymentDetails.remaining && Object.keys(customerGave).length && isValidateEnabled
        
    const handlePaymentMethod = (payment: PaymentProps) =>{
        if (!(Object.keys(customerGave).includes(payment.method_name))) {
            setCustomeGave((obj) => {
                if((Object.keys(customerGave).length) > 0){
                    obj[payment.method_name] = 0;
                }else{
                    setPaymentDetails({change: 0.00, remaining: 0.00, payment_status: "Paid"});
                    obj[payment.method_name] = totalPrice;
                }
                return obj;
            });
            setActivePayMethod(payment.method_name)
        }
    }

    const handleRemovePayment = (method: string) =>{
        setBtnClicks((obj) => ({...obj, isNewPayment: true}));
        setCustomeGave((obj) => {
            const removedMethod = method;
            const {[removedMethod]: removedKey, ...newObj} = obj;
            
            const totals = Object.values(newObj).reduce((acc, curr) => acc + curr, 0);

            const details = calcAndSetChange(totals, totalPrice);
            setPaymentDetails(details);
            
            return newObj;
        });

        const newActiveMethod = Object.keys(customerGave).find((payMethod) => payMethod !== method) || '';
        setActivePayMethod(newActiveMethod);
    }

    const handleChangeAmount = async(method: string) =>{

        setActivePayMethod(method)
        if(method === activePayMethod && currentWidth < 768){
            await Swal.fire({
                title: "Enter new amount",
                input: "number",
                showCancelButton: true,
                confirmButtonText: "Confirm",
            }).then((result) => {
                if (result.isConfirmed) {
                    PaymentCalcHandles.handleDigitClick(result.value)
                }
            });
        }
        
    }

    return(
        <div className="col-12 col-md-3 d-flex flex-column" >
            {
                currentWidth < 768 && 
                <ChangeDisplay 
                    customerGave = {customerGave} 
                    totalPrice = {totalPrice} 
                    paymentDetails = {paymentDetails}
                />
            }
            <div className="p-2">
                <h3>Payment Method</h3>
            </div>
            <div className="ordersCard" style={{height: "60dvh"}}>
                {
                    payments.map((payment, i)=>(
                        <button  key={i} onClick={() =>  handlePaymentMethod(payment)}
                        className="d-flex p-2 btn border gap-3 cursor-pointer col-12">
                            {payment.icon}
                            <h6>{payment.method_name}</h6>
                        </button>
                    ))
                }
                <div className="px-2 mt-2">
                    <h4>Summary</h4>
                </div>
                {
                    Object.keys(customerGave).map((method, i) =>(
                        <div key={i}
                        className={`${activePayMethod === method? "bg-light ": ""} d-flex py-4 px-2 border col-12
                        justify-content-between`}>
                            <div onClick={() => handleChangeAmount(method)}
                            className={`col-10 d-flex 
                             justify-content-between `}>
                                <h6>{method}</h6>
                                <div className="d-flex gap-4">
                                    <h6>
                                        { customerGave[method] } 
                                        <span>Ksh</span>
                                    </h6>
                                </div>
                            </div>
                            <MdCancel size={24} onClick={() => handleRemovePayment(method)} />
                        </div>
                    ))
                }
            </div>
            <div className="d-flex flex-grow-1 border sticky-bottom
            justify-content-center text-center">
                <button onClick={() =>{
                    setIsvalidateEnabled(false);
                    handleVilidateClick(customerGave, paymentDetails, setIsvalidateEnabled);
                } } 
                disabled={isDisableBtn ? false : true}
                className="btn btn-warning rounded-none flex-grow-1 font-weight-bold"> 
                    <FaAngleRight size={24}/> 
                    <p style={{fontSize: "24px"}}>Validate</p>
                </button>
            </div>
        </div>
    )
}

export default PaymentMethod;