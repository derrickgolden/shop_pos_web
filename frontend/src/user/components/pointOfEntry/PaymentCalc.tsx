import React, { useEffect, useState } from 'react';
import { FaDeleteLeft } from 'react-icons/fa6';
import ChangeDisplay from './ChangeDisplay';
import { ChangeDisplayProps } from './types';

export interface PaymentCalcProps extends ChangeDisplayProps{
  PaymentCalcHandles: {
    handleDigitClick: (digit: number) => void;
    handleDeleteDigit: () => void;
    handleSetToQuantityChange: (digit: number) => void;
  };
}

const PaymentCalc: React.FC<PaymentCalcProps> = ({ totalPrice, customerGave, PaymentCalcHandles, paymentDetails }) => {
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() =>{
    const bol = Object.keys(customerGave).length ? false : true;
    setIsDisabled(bol);
  });

  const renderDigitButtons = (digits: number[]) => {
    return digits.map((digit) => (
      <button disabled = { isDisabled }
        className='btn btn-outline-secondary btn-calc col-4 flex-grow-1 h-100 rounded-0'
        key={digit}
        onClick={() => PaymentCalcHandles.handleDigitClick(digit)}
      >
        {digit}
      </button>
    ));
  };

  return (
    <div className='d-none d-md-block col-6 h-100' >
      <ChangeDisplay 
        customerGave = {customerGave} 
        totalPrice = {totalPrice} 
        paymentDetails = {paymentDetails}
      />
      <div className='d-flex flex-grow-1 'style={{height: "59.2dvh"}} >
        <div className='d-flex flex-column col-9 ' >
          <div className='d-flex flex-grow-1'>{renderDigitButtons([1, 2, 3])}</div>
          <div className='d-flex flex-grow-1'>{renderDigitButtons([4, 5, 6])}</div>
          <div className='d-flex flex-grow-1'>{renderDigitButtons([7, 8, 9])}</div>
          <div className='d-flex flex-grow-1'>
            <button disabled = { isDisabled }
              className='btn btn-outline-secondary btn-calc col-4 rounded-0'
              // onClick={PaymentCalcHandles?.handleQuantityIncByOne}
            >
              +
            </button>
            <button disabled = { isDisabled }
                className='btn btn-outline-secondary btn-calc col-4 rounded-0'
                // onClick={() => PaymentCalcHandles?.handleDigitClick(Number('.'))}
            >
                .
            </button>
            {renderDigitButtons([0])}
          </div>
        </div>
        <div className='d-flex flex-column col-3'>
          {[10, 20, 50].map((figure, i) =>(
            <button key={i} disabled = { isDisabled }
              onClick={() => PaymentCalcHandles?.handleSetToQuantityChange(figure)}
              className='btn btn-outline-secondary flex-grow-1 rounded-0'
            >
              +{figure}
            </button>
          ))}
          <button
            onClick={PaymentCalcHandles?.handleDeleteDigit}
            className='btn btn-outline-secondary flex-grow-1'
          >
            <FaDeleteLeft />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCalc;
