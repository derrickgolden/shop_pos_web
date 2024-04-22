import { BtnClicksProps } from "../../sections/pointOfEntry/types";
import { OrderDetail } from "../SalesEntry";

interface calcNewDetailsParams {
    btnClicks: BtnClicksProps;
    orderDetail: OrderDetail;
    operator: "add" | "slice" | "digitClick";
    setBtnClicks: React.Dispatch<React.SetStateAction<BtnClicksProps>>;
    digit: number;
}

interface RightOperandParams extends calcNewDetailsParams {
    operand: number;
}

export const calcNewUnitDiscPrice = (params: calcNewDetailsParams) =>{
    const { btnClicks, orderDetail } = params;
    const { focusedBtn } = btnClicks;
    let { units: newUnits, discount: newDisc, price: newPrice } = orderDetail;

    if(focusedBtn === 'qty'){
        const operand = rightOperand({...params, operand: newUnits});
        newUnits = operand;

    }else if(focusedBtn === 'disc'){
        const operand = rightOperand({...params, operand: newDisc});
        newDisc = operand;

    }else if(focusedBtn === 'price'){
        const operand = rightOperand({...params, operand: newPrice});
        newPrice = operand;

    }

    return({newUnits, newDisc, newPrice});
}

const rightOperand = ({operand, operator, btnClicks, digit, setBtnClicks}: RightOperandParams) =>{
    if(operator === "add"){
        operand = operand + digit;
    }else if(operator === "slice"){
        const unitsString = operand.toString();
        operand = Math.max(parseInt(unitsString.slice(0, -1), 10) || 0, 0);
    }else if(operator === "digitClick"){
        if(btnClicks.isDigit){
            const newUnitsAsString = operand.toString() + digit.toString();
            operand = parseInt(newUnitsAsString, 10);
        }else{
            operand = digit;
            setBtnClicks((obj) => ({...obj, isDigit: true}));
        };
    }
    return operand;
};
