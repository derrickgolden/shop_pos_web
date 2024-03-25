import React, { useEffect, useState } from "react";
import CustomerInvoice from "../../components/pointOfEntry/CustomerInvoice";
import PaymentCalc from "../../components/pointOfEntry/PaymentCalc"
import PaymentMethod from "../../components/pointOfEntry/PaymentMethod";
import { calcAndSetChange } from "../../controllers/calculations/calcAndSetChange";
import { ValidateOrdersProps } from "../../components/pointOfEntry/types";

interface ValidateOrdersProps2 extends ValidateOrdersProps{
    totalPrice: number;
    payMethods: string[];
    activePayMethod: string;
    setActivePayMethod: React.Dispatch<React.SetStateAction<string>>;
}

const ValidateOrders: React.FC<ValidateOrdersProps2> = ({handleVilidateClick, totalPrice, 
    setPayMethods, payMethods, customerGave, setCustomeGave, activePayMethod, setActivePayMethod }) =>{

    const [change, setChange] = useState({remaining: 0.00, change: 0.00});
    const [startNewEntry, setStartNewEntry] = useState(true);

    useEffect(() =>{
        if(payMethods.length){
            setCustomeGave((obj) => {
                const totals = Number(Object.values(obj).reduce((acc, curr) => acc + curr, 0));
    
                calcAndSetChange(totals, totalPrice, setChange);
                return obj;
            });
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
                // console.log(totals)

                calcAndSetChange(totals, totalPrice, setChange);

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

                calcAndSetChange(totals, totalPrice, setChange);

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
                // console.log(totals)

                calcAndSetChange(totals, totalPrice, setChange);

                return {...obj ,[activePayMethod]: newFig};
            });
            setStartNewEntry(false);
            
        }
    }
    return(
        <div className="d-flex " style={{height: "82dvh"}}>
            <PaymentMethod 
                handleVilidateClick = {handleVilidateClick}
                setPayMethods = {setPayMethods}
                activePayMethod = {activePayMethod}
                totalPrice = {totalPrice}
                payMethods = {payMethods}
                customerGave = {customerGave}
                change = {change}
                setCustomeGave = {setCustomeGave}
                setActivePayMethod = {setActivePayMethod}
                setChange = {setChange}
                setStartNewEntry = {setStartNewEntry}
                PaymentCalcHandles = {PaymentCalcHandles}
            />
            <PaymentCalc 
                change = {change}
                totalPrice = {totalPrice}
                payMethods = {payMethods}
                PaymentCalcHandles = {PaymentCalcHandles}
            />
            <CustomerInvoice />
        </div>
    )
}

export default ValidateOrders;