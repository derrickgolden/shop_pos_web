import { useRef } from 'react';

import { FaAngleRight, FaPrint } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";

import { useReactToPrint } from 'react-to-print';

import Receipt from '../../components/pointOfEntry/Receipt';
import { EntryStepTypes, SaleRes } from '../../pages/types';
import InvoiceDesign from '../../components/sharedComponents/InvoiceDesign';
import { Customer } from '../../components/customers/types';
import ValidateOrderNavbar from '../../components/pointOfEntry/ValidateOrderNavbar';
import { Order } from '..';

interface PrintReceiptProps{
    saleRes: SaleRes | undefined;
    handleStartNewOrderClick: () => void;
    selectCustomer: Customer | undefined;
    setEntryStep: React.Dispatch<React.SetStateAction<EntryStepTypes>>;
    ordersList: Order[];
}

const PrintReceipt: React.FC<PrintReceiptProps> = ({ handleStartNewOrderClick, 
    saleRes, selectCustomer, setEntryStep, ordersList }) =>{

    const componentRef = useRef<HTMLDivElement | null>(null);

    const event = new KeyboardEvent('keydown', {
        key: 'p',
        ctrlKey: true,
        shiftKey: true,
    });
          
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        onBeforePrint: () => {
            window.dispatchEvent(event);
        },
    });

    return ordersList?.map((order, i) => {
        if(order.activeOrder && saleRes !== undefined ){
            const {totalPrice, orderDetails } = order;
        return(
        <div key={i}>
            <div className="d-none d-md-block">
                <ValidateOrderNavbar 
                    setEntryStep={setEntryStep}
                    totalPrice={totalPrice}
                    step={{step: "receipt"}}
                />
            </div>
            
            <div className="d-flex print-receipt">
                <div className="col-12 col-md-8 d-flex flex-column justify-content-between">
                    <div className="px-4">
                        <div className="py-3 text-center">
                            <h1 className="d-none d-sm-block">Payment Successful</h1>
                            <h3 className="d-sm-none">Payment Successful</h3>
                        </div>
                        <div>
                            <button onClick={handlePrint} className="col-12 border py-3" style={{ fontSize: "larger" }}>
                                <FaPrint /> Print Receipt
                            </button>
                        </div>
                        <div className="input-group my-3">
                            <input type="text" className="form-control py-2" placeholder="Email: the receipt" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                            <div className="input-group-append">
                                <span className="input-group-text py-2 rounded-end rounded-start-0" id="basic-addon2">Send <IoIosSend /></span>
                            </div>
                        </div>
                    </div>
                    <div className='d-md-none center-receipt'>
                        <Receipt
                            componentRef={componentRef}
                            saleRes={saleRes}
                            orderDetails={orderDetails}
                            totalPrice={totalPrice}
                            selectCustomer={selectCustomer}
                        />
                    </div>
                    <div>
                        <button onClick={handleStartNewOrderClick} className="btn btn-warning col-12 p-3 rounded-0 p-md-5">
                            <h2><FaAngleRight /> New Order</h2>
                        </button>
                    </div>
                </div>
                <div className='d-none col-4 print-receipt'>
                    {saleRes.invoice_id &&
                        <InvoiceDesign
                            componentRef={componentRef}
                            saleRes={saleRes}
                            orderDetails={orderDetails}
                            totalPrice={totalPrice}
                            selectCustomer={selectCustomer}
                        />
                    }
                </div>
                <div className='d-none d-md-block col-4 print-receipt'>
                    <Receipt
                        componentRef={componentRef}
                        saleRes={saleRes}
                        orderDetails={orderDetails}
                        totalPrice={totalPrice}
                        selectCustomer={selectCustomer}
                    />
                </div>
            </div>            
        </div>
        )
        } 
    })           
}

export default PrintReceipt;

