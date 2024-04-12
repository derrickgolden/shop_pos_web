import React, { useEffect, useState } from "react";
import CustomerInvoice from "../../components/pointOfEntry/CustomerInvoice";
import PaymentCalc from "../../components/pointOfEntry/PaymentCalc"
import PaymentMethod from "../../components/pointOfEntry/PaymentMethod";
import { calcAndSetChange } from "../../controllers/calculations/calcAndSetChange";
import { PaymentMethodProps, ValidateOrdersProps } from "../../components/pointOfEntry/types";
import { PaymentDetails } from "./types";
import { PaymentObject } from "../../pages/types";

interface ValidateOrdersProps2 extends ValidateOrdersProps{
    totalPrice: number;
    activePayMethod: string;
    setActivePayMethod: React.Dispatch<React.SetStateAction<string>>;
    customerGave: {[key: string]: number;};
    setCustomeGave: React.Dispatch<React.SetStateAction<PaymentObject>>;
    startNewEntry : boolean;
    paymentDetails: PaymentDetails;
    setStartNewEntry: React.Dispatch<React.SetStateAction<boolean>>;
    setPaymentDetails: React.Dispatch<React.SetStateAction<PaymentDetails>>; 
}

const ValidateOrders: React.FC<ValidateOrdersProps2> = ({handleVilidateClick, totalPrice,
    activePayMethod, setActivePayMethod, customerGave, setCustomeGave, startNewEntry, setStartNewEntry,
    paymentDetails, setPaymentDetails }) =>{

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
                const newFig = startNewEntry? digit : Number(obj[activePayMethod] + String(digit)) || 0;

                // remove the method being added first;
                const {[activePayMethod]: removedKey, ...newObj} = obj;
                const sum = Object.values(newObj).reduce((acc, curr) => acc + curr, 0);
                const totals = Number( sum + newFig)

                const details = calcAndSetChange(totals, totalPrice);
                setPaymentDetails(details);

                return {...obj ,[activePayMethod]: newFig};
            });
            currentWidth < 768 ? setStartNewEntry(true) : setStartNewEntry(false);
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
                const newFig = startNewEntry? digit : obj[activePayMethod] + digit;

                // remove the method being added first;
                const {[activePayMethod]: removedKey, ...newObj} = obj;
                const sum = Object.values(newObj).reduce((acc, curr) => acc + curr, 0);
                const totals = Number( sum + newFig)

                const details = calcAndSetChange(totals, totalPrice);
                setPaymentDetails(details);

                return {...obj ,[activePayMethod]: newFig};
            });
            setStartNewEntry(false);
            
        }
    }
    return(
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
                setStartNewEntry = {setStartNewEntry}
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
    )
}

export default ValidateOrders;