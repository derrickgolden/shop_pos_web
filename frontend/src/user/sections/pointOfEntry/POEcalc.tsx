import React, { useState } from 'react';
import { FaDeleteLeft, FaRegNoteSticky } from 'react-icons/fa6';
import { FaChevronRight } from 'react-icons/fa';
import { RxAvatar } from 'react-icons/rx';
import { HiOutlineReceiptRefund } from 'react-icons/hi';
import { BtnClicksProps, PoeCalcHandles } from './types';
import { Customer } from '../../components/customers/types';

interface PosCalcProps{
    PoeCalcHandles: PoeCalcHandles;
    selectCustomer: Customer | undefined;
    btnClicks: BtnClicksProps;
}
const POEcalc: React.FC<PosCalcProps> = ({ PoeCalcHandles, selectCustomer, btnClicks }) => {
  const renderDigitButtons = (digits: number[]) => {
    return digits.map((digit) => (
      <button
        className='btn btn-outline-secondary btn-calc col-4  rounded-0'
        key={digit}
        onClick={() => PoeCalcHandles.handleDigitClick(digit)}
      >
        {digit}
      </button>
    ));
  };

  return (
    <div className=''>
      <div className='d-flex flex-grow-1'>
        <button
          className='btn btn-outline-secondary flex-grow-1 rounded-0'
          onClick={PoeCalcHandles.handleRefund}
        >
          <HiOutlineReceiptRefund /> Refund
        </button>
        <button
          className='btn btn-outline-secondary payment flex-grow-1 rounded-0'
          onClick={PoeCalcHandles.handleCustomerNote}
        >
          <FaRegNoteSticky /> Customer Note
        </button>
      </div>
      <div className='d-flex '>
        <div className='d-flex flex-column col-4 p-0'>
          <button 
            className={`${selectCustomer ? "btn-secondary" : "btn-outline-secondary "} btn col-12 rounded-0`}
            onClick={PoeCalcHandles.handleCustomer}
          >
            <RxAvatar /> {selectCustomer?.full_name || "Customer"}
          </button>
          <button
            className='btn btn-warning payment flex-grow-1 col-12 rounded-0'
            onClick={PoeCalcHandles.handlePayment}
          >
            <FaChevronRight /> <br /> Payment
          </button>
        </div>
        <div className='d-flex flex-column col-6 p-0 m-0'>
          <div className='d-flex'>{renderDigitButtons([1, 2, 3])}</div>
          <div className='d-flex'>{renderDigitButtons([4, 5, 6])}</div>
          <div className='d-flex'>{renderDigitButtons([7, 8, 9])}</div>
          <div className='d-flex'>
            <button
              className='btn btn-outline-secondary btn-calc col-4 rounded-0'
              onClick={PoeCalcHandles.handleQuantityIncByOne}
            >
              +
            </button>
            <button
              className='btn btn-outline-secondary btn-calc col-4 rounded-0'
              onClick={() => PoeCalcHandles.handleDigitClick(Number('.'))}
            >
                .
            </button>
            {renderDigitButtons([0])}
          </div>
        </div>
        <div className='d-flex flex-column col-2 p-0'>
          <button
            onClick={() => {PoeCalcHandles.setBtnClicks((obj) => ({...obj, focusedBtn: "qty", isDigit: false}))}}
            className={`btn btn-outline-secondary btn-calc rounded-0
             ${btnClicks.focusedBtn === 'qty'? ' active': ''}`}
          >
            Qty
          </button>
          <button
            onClick={() => PoeCalcHandles.setBtnClicks((obj) => ({...obj, focusedBtn: "disc", isDigit: false}))}
            className={`btn btn-outline-secondary btn-calc rounded-0
             ${btnClicks.focusedBtn === 'disc'? ' active': ''}`}
          >
            Disc
          </button>
          <button
            onClick={() => PoeCalcHandles.setBtnClicks((obj) => ({...obj, focusedBtn: "price", isDigit: false}))}
            className={`btn btn-outline-secondary btn-calc rounded-0
             ${btnClicks.focusedBtn === 'price'? ' active': ''}`}
          >
            Price
          </button>
          <button
            onClick={PoeCalcHandles.handleDecreaseNcancelOrder}
            className='btn btn-outline-secondary btn-calc rounded-0'
          >
            <FaDeleteLeft />
          </button>
        </div>
      </div>
    </div>
  );
};

export default POEcalc;
