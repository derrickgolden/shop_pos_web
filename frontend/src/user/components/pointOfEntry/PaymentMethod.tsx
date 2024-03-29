
import React, { useState } from "react";
import { BsCashCoin } from "react-icons/bs";
import { FaAngleRight, FaRegCreditCard } from "react-icons/fa";
import { MdAccountBalanceWallet, MdCancel } from "react-icons/md";
import { calcAndSetChange } from "../../controllers/calculations/calcAndSetChange";
import Swal from "sweetalert2";
import ChangeDisplay from "./ChangeDisplay";
import { PaymentCalcProps } from "./PaymentCalc";
import { ValidateOrdersProps } from "./types";

const payments = [
    {icon:<BsCashCoin size={24}/>, method_name: "Cash", method: "cash", payment_method_id: 1},
    {icon:<FaRegCreditCard size={24}/>, method_name: "Bank", method: "bank", payment_method_id: 3},
    {icon:<MdAccountBalanceWallet size={24}/>, method_name: "Customer Account", method: "customer_acc", payment_method_id: 2},
]

interface PaymentMethodProps extends ValidateOrdersProps, PaymentCalcProps{
    activePayMethod: string;
    setActivePayMethod: React.Dispatch<React.SetStateAction<string>>;
    setStartNewEntry: React.Dispatch<React.SetStateAction<boolean>>;
    setChange: React.Dispatch<React.SetStateAction<{ remaining: number; change: number; }>>; 
}

interface PaymentProps{
    icon: JSX.Element;
    method_name: string;
    method: string;
    payment_method_id: number;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
    handleVilidateClick, setPayMethods, totalPrice, payMethods, activePayMethod, customerGave, 
    change, setCustomeGave, setActivePayMethod, setChange, PaymentCalcHandles, setStartNewEntry }) =>{

    const [ isValidateEnabled, setIsvalidateEnabled ] = useState(true)
    const currentWidth = window.innerWidth;

    const handlePaymentMethod = (payment: PaymentProps) =>{
        if (!payMethods.includes(payment.method_name)) {
            setPayMethods([...payMethods, payment.method_name]);
            setCustomeGave((obj) => {
                obj[payment.method_name] = payMethods.length? 0 : totalPrice;
                payMethods.length? null : setChange({change: 0.00, remaining: 0.00})
                return obj;
            });
            setActivePayMethod(payment.method_name)
        }
    }

    const handleRemovePayment = (method: string) =>{
        
        setPayMethods((arr) => (arr.filter((payMethod) => payMethod !== method)));
        setStartNewEntry(true);
        setCustomeGave((obj) => {
            const removedMethod = method;
            const {[removedMethod]: removedKey, ...newObj} = obj;
            
            const totals = Object.values(newObj).reduce((acc, curr) => acc + curr, 0);

            calcAndSetChange(totals, totalPrice, setChange);
            
            const newActiveMethod = payMethods.find((payMethod) => payMethod !== method) || '';
            setActivePayMethod(newActiveMethod);

            return newObj;
        });
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
                    payMethods = {payMethods} 
                    totalPrice = {totalPrice} 
                    change = {change}
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
                            {/* {payment.icon} */}
                            <h6>{payment.method_name}</h6>
                        </button>
                    ))
                }
                <div className="px-2 mt-2">
                    <h4>Summary</h4>
                </div>
                {
                    payMethods.map((method, i) =>(
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
            <div className="d-flex flex-grow-1 border 
            justify-content-center text-center">
                <button onClick={() =>{
                    setIsvalidateEnabled(false);
                    handleVilidateClick(customerGave, change, setIsvalidateEnabled);
                } } 
                disabled={!change.remaining && payMethods.length && isValidateEnabled ? false : true}
                className="btn btn-warning rounded-none flex-grow-1 font-weight-bold"> 
                    <FaAngleRight size={24}/> 
                    <p style={{fontSize: "24px"}}>Validate</p>
                </button>
            </div>
        </div>
    )
}

export default PaymentMethod;