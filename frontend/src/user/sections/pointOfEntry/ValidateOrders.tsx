import React, { useEffect } from "react";
import CustomerInvoice from "../../components/pointOfEntry/CustomerInvoice";
import PaymentCalc from "../../components/pointOfEntry/PaymentCalc"
import PaymentMethod from "../../components/pointOfEntry/PaymentMethod";
import { calcAndSetChange } from "../../controllers/calculations/calcAndSetChange";
import { ValidateOrdersProps } from "../../components/pointOfEntry/types";
import { BtnClicksProps, PaymentDetails } from "./types";
import { EntryStepTypes, PaymentObject } from "../../pages/types";
import ValidateOrderNavbar from "../../components/pointOfEntry/ValidateOrderNavbar";

interface ValidateOrdersProps2 extends ValidateOrdersProps{
    totalPrice: number;
    activePayMethod: string;
    setActivePayMethod: React.Dispatch<React.SetStateAction<string>>;
    customerGave: {[key: string]: number;};
    setCustomeGave: React.Dispatch<React.SetStateAction<PaymentObject>>;
    paymentDetails: PaymentDetails;
    setPaymentDetails: React.Dispatch<React.SetStateAction<PaymentDetails>>;
    btnClicks: BtnClicksProps;
    setBtnClicks: React.Dispatch<React.SetStateAction<BtnClicksProps>>;
    setEntryStep: React.Dispatch<React.SetStateAction<EntryStepTypes>>
}

const ValidateOrders: React.FC<ValidateOrdersProps2> = ({handleVilidateClick, totalPrice,
    activePayMethod, setActivePayMethod, customerGave, setCustomeGave, btnClicks,
    setBtnClicks, paymentDetails, setPaymentDetails, setEntryStep }) =>{

    useEffect(() =>{
        if(Object.keys(customerGave).length){
            setCustomeGave((obj) => {
                const totals = Number(Object.values(obj).reduce((acc, curr) => acc + curr, 0));

                const details = calcAndSetChange(totals, totalPrice);
                setPaymentDetails(details);
                return obj;
            });
        }else{
            setPaymentDetails(obj => ({...obj, remaining: totalPrice}))
        }
    }, []);

    const PaymentCalcHandles = {
        handleDigitClick: (digit: number) =>{
            const currentWidth = window.innerWidth;
            setCustomeGave((obj) => {
                const newFig = btnClicks.isNewPayment? digit : Number(obj[activePayMethod] + String(digit)) || 0;

                // remove the method being added first;
                const {[activePayMethod]: removedKey, ...newObj} = obj;
                const sum = Object.values(newObj).reduce((acc, curr) => acc + curr, 0);
                const totals = Number( sum + newFig)

                const details = calcAndSetChange(totals, totalPrice);
                setPaymentDetails(details);

                return {...obj ,[activePayMethod]: newFig};
            });
            setBtnClicks((obj) => {
                return currentWidth < 768 ? {...obj, isNewPayment: true}: {...obj, isNewPayment: false}
            })
        },
        handleDeleteDigit: () =>{
            setCustomeGave((obj) => {
                let numberString = obj[activePayMethod].toString();
                
                let modifiedString = numberString.slice(0, -1);

                let newFig = parseFloat(modifiedString) || 0;

                // remove the method being deleted;
                const {[activePayMethod]: removedKey, ...newObj} = obj;
                // calculate new totals
                const sum = Object.values(newObj).reduce((acc, curr) => acc + curr, 0);
                const totals = Number( sum + newFig)

                const details = calcAndSetChange(totals, totalPrice);
                setPaymentDetails(details);

                return {...newObj, [activePayMethod] : newFig};
            })
        },
        handleSetToQuantityChange: (digit: number) =>{
            setCustomeGave((obj) => {
                const newFig = btnClicks.isNewPayment? digit : obj[activePayMethod] + digit;

                // remove the method being added first;
                const {[activePayMethod]: removedKey, ...newObj} = obj;
                const sum = Object.values(newObj).reduce((acc, curr) => acc + curr, 0);
                const totals = Number( sum + newFig)

                const details = calcAndSetChange(totals, totalPrice);
                setPaymentDetails(details);

                return {...obj ,[activePayMethod]: newFig};
            });
            setBtnClicks((obj) => ({...obj, isNewPayment: false}));  
        }
    }
    return(
        <div>
            <ValidateOrderNavbar 
                setEntryStep={setEntryStep}
                totalPrice={totalPrice}
                step={{step: "payment"}}
            />
            <div className="d-flex payment-step" >
                <PaymentMethod 
                    handleVilidateClick = {handleVilidateClick}
                    activePayMethod = {activePayMethod}
                    totalPrice = {totalPrice}
                    customerGave = {customerGave}
                    paymentDetails = {paymentDetails}
                    setCustomeGave = {setCustomeGave}
                    setActivePayMethod = {setActivePayMethod}
                    setPaymentDetails= {setPaymentDetails}
                    setBtnClicks = {setBtnClicks}
                    PaymentCalcHandles = {PaymentCalcHandles}
                />
                <PaymentCalc 
                    paymentDetails = {paymentDetails}
                    totalPrice = {totalPrice}
                    PaymentCalcHandles = {PaymentCalcHandles}
                    customerGave = {customerGave}
                />
                <CustomerInvoice />
            </div>
        </div>
    )
}

export default ValidateOrders;