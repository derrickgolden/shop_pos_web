import { useSelector } from "react-redux";
import { ReceiptInvoiceProps } from "../pointOfEntry/types";
import { RootState } from "../../../redux/store";
import { getSessionStorage } from "../../controllers/getSessionStorage";
import html2pdf from "html2pdf.js";
import { useEffect, useRef } from "react";

const InvoiceDesign: React.FC<ReceiptInvoiceProps> = ({componentRef, saleRes, orderDetails, totalPrice, selectCustomer}) =>{
    const isMounted = useRef(false);
    const paymentDetails = useSelector((state: RootState) => state.paymentDetails);

    const userShop = getSessionStorage();
    const { localShop } = userShop;

    const handleDownloadPDF = () => {
        const opt = {
            margin:       1,
            filename:     `${selectCustomer?.full_name}-${new Date(saleRes.sale_date).toLocaleDateString()}`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        const element = document.getElementById('invoice-design');

        if (element) {
            html2pdf().from(element).set(opt).save();
        }
    };

    useEffect(() =>{
        if(!isMounted.current){
            handleDownloadPDF();
            isMounted.current = true;
        }
    }, [isMounted]);

    return(
        <div ref={componentRef} id="invoice-design" className="p-2" >
            <div className="text-end">
                <h1>INVOICE</h1>
                <h6>#{saleRes.invoice_id}</h6>
            </div>
            <div>
                <table className="table table-borderless">
                    <tbody>
                        <tr>
                            <th scope="row ">BILLED TO:</th>
                            <td>{selectCustomer?.full_name}</td>
                        </tr>
                        {
                            paymentDetails.map((payment, i) =>(
                                <tr key={payment.payment_detail_id} className="py-0 ">
                                    <th scope="text-start py-0">PAY TO:</th>
                                    <td className="d-flex flex-column py-0">
                                        {payment.payment_name}
                                    </td>
                                    {
                                        Object.keys(payment.details).map((key, i) =>(
                                            <tr key={i}>
                                                <td className="pr-2">{key}:</td>
                                                <td>{payment.details[key]}</td>
                                            </tr>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Item</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Sub-Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderDetails.map((order, i) =>(
                            <tr key={i}>
                                <th scope="row">{i + 1}</th>
                                <td>{order.product_name}</td>
                                <td>{order.units}</td>
                                <td>{order.sub_total}</td>
                            </tr>
                        ))}
                        <tr>
                            <th colSpan={3}>Total</th>
                            <th > <span>Ksh. {totalPrice}</span></th>
                        </tr>
                        <tr>
                            <th colSpan={3}>TOTAL DUE</th>
                            <th > <span>KSH. {saleRes.remaining}</span></th>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <p>Payment is required within 3 business days of invoice date.</p>
                <h6>Thank you for business.</h6>
                <h5>{localShop?.shop_name}</h5>
            </div>
        </div>
    )
};

export default InvoiceDesign;