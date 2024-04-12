import { server_baseurl } from "../../../baseUrl";
import { getSessionStorage } from "../../controllers/getSessionStorage";
import OrdersCard from "./OrdersCard";
import calculateVAT from "../../controllers/calculations/calculateVAT";
import { ReceiptInvoiceProps } from "./types";

const Receipt:React.FC<ReceiptInvoiceProps> =({componentRef, saleRes, orderDetails, totalPrice, selectCustomer}) =>{
    const userShop = getSessionStorage();
    const { localShop, user } = userShop;

    return(
        <div className="d-flex justify-content-center h-100 m-auto "
            style={{backgroundColor: "#a8a8a8"}}>
                <div ref={componentRef}
                className="col-11 my-2 bg-white p-2 receipt " >
                    <header className="d-flex flex-column text-center mb-2">
                        <div>
                            <img src={`${server_baseurl}/${localShop?.logo_path}`} alt="logo" 
                            style={{width: "40px", height:"30px"}}/>
                            <span>{localShop?.shop_name}</span>
                        </div>
                        <span className=" col-10 m-auto">
                            {localShop?.shop_email}
                        </span>
                        <span className="border-bottom col-10 m-auto pb-2 mb-2">
                            {localShop?.shop_tel}
                        </span>
                        <span>Served by {user?.last_name} {user?.first_name}</span>
                        <span><b>{saleRes.sale_id}</b></span>
                    </header>
                    <div className={`d-flex flex-column border-3 flex-grow-1`}>
                            {orderDetails.map((order, i) =>(
                                <OrdersCard 
                                    key={i}
                                    order={order}
                                    orderDetails = {orderDetails }
                                    activeCard = {0} 
                                    handleEditOrder = {() => {}}
                                />
                            ))}
                        <div className="d-flex col-8 py-4 pl-4 justify-content-between"
                        style={{ marginLeft: 'auto' }}>
                            <h3>TOTAL</h3>
                            <h3>{totalPrice} Ksh</h3>
                        </div>
                        <div >
                            {Object.keys(saleRes.customerGave).map((key, i) =>(
                                <div key={i} className="d-flex pl-4 justify-content-between">
                                    <p>{key}</p>
                                    <p>{saleRes.customerGave[key]} Ksh</p>
                                </div>
                            ))}
                        </div>
                        <div className="d-flex col-8 pl-4 justify-content-between"
                        style={{ marginLeft: 'auto' }}>
                            <h4>CHANGE</h4>
                            <h4>{saleRes.change} Ksh</h4>
                        </div>
                        <div className="d-flex pl-4 justify-content-between">
                            {calculateVAT(totalPrice, 16).map((data, i) =>(
                                <p className='d-flex flex-column'
                                key = {i}> 
                                    <span>{data.label}</span> <span>{data.value}</span>
                                </p>
                            ))}
                        </div>
                        <div className=" text-center py-4 pl-4 col-12 ">
                            <p>Order {saleRes.sale_id}</p>
                            <p className='d-flex justify-content-center gap-4 col-12'> 
                                <span>{new Date(saleRes.sale_date).toDateString()}</span> 
                                <span>{new Date(saleRes.sale_date).toLocaleTimeString()}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default Receipt;