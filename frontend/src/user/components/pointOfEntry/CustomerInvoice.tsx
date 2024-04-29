import { useEffect, useState } from 'react';

import { RxAvatar } from 'react-icons/rx';
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { getPaymentDetails } from '../apiCalls/getApiCalls';
import { getSessionStorage } from '../../controllers/getSessionStorage';
import { setPaymentDetails } from '../../../redux/paymentDetails';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useCustomerContext } from '../../pages/createContext';

const CustomerInvoice = () =>{
    const dispatch = useDispatch();
    const { selectCustomer, setSendInvoice, sendInvoice, setEntryStep } = useCustomerContext();
    const paymentDetails = useSelector((state: RootState) => state.paymentDetails);

    useEffect(() =>{
        if(sendInvoice){
            const userShop = getSessionStorage();
            const { localShop } = userShop;
            if(localShop){
                const shop_id = localShop.shop_id;
                const data = JSON.stringify({shop_id});
                getPaymentDetails(data).then((data) =>{
                    dispatch(setPaymentDetails(data));
                });
            };
        }
    }, [sendInvoice]);

    return(
        <div className="d-none d-md-flex flex-column col-3" >
            <button onClick={() => setEntryStep({current: "customerList", prev: "payment"})}
            className={`${selectCustomer? "btn-info" : "btn-outline-info "} btn border flex-row-1 py-3`}>
                <h5><RxAvatar /> {selectCustomer?.full_name || "Customer"}</h5>
            </button>
            <button onClick={() => setSendInvoice(!sendInvoice)}
            className={`${sendInvoice? "btn-info" : "btn-outline-info "} btn border flex-row-1 py-3`}>
                <h5><LiaFileInvoiceSolid /> Invoice</h5>
            </button>
            <div className='flex-grow-1'
            style={{backgroundColor: "#e6e9e9"}}>
                {
                    paymentDetails.map((payment, i) =>(
                        <div key={payment.payment_detail_id}>
                            {payment.payment_name}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default CustomerInvoice;