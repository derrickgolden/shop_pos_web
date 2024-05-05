import { useState } from "react";
import { FaAngleLeft, FaPlus } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";

const ordersTableDetails= [{header: "Date", data: "date"}, {header: "Total", data: "totalPrice"}, 
    {header: "Status", data: "status"}
]
const salesTableDetails= [{header: "Date", data: "sale_date"}, {header: "Reciept Number", data: "sale_id"}, 
    {header: "Customer", data: "customer_id"},  {header: "Cashier", data: "cashier"},
    {header: "Total", data: "total_price"}, {header: "Status", data: "payment_status"},
]

const DisplayList = ({showReview, handleEntryStep, handleNewCustomerOrder, list, listType,
    handleChangeActiveOrder, handleDeleteCustomerOrder, setShowReview
}) =>{
    const [tableDetails, setTableDetails] = useState<{
        header: string;
        data: string;
    }[]>()
    useState(() =>{
        listType === "ordering" ?
            setTableDetails(ordersTableDetails) :
            setTableDetails(salesTableDetails) 
    })
    // console.log(list);
    return(
            <div className={`${showReview? "d-none ": ""} col-12 col-sm-6 col-md-7 bg-light h-100 `}>
                <div className="d-flex py-1 px-2 gap-4 bg-secondary" style={{height: "3rem"}}>
                    <button onClick={() => handleEntryStep()}
                        className="d-none d-md-block navbar-brand pl-2 btn btn-light">
                            &nbsp;<FaAngleLeft /> Back
                    </button>
                    <button onClick={() => handleEntryStep()}
                        className="d-none d-sm-block d-md-none navbar-brand btn btn-light">
                            &nbsp;<FaAngleLeft size={25}/> 
                    </button>
                    <button onClick={() => handleNewCustomerOrder({date: new Date().toLocaleString()})}
                        className="d-none d-md-block navbar-brand pl-2 btn btn-warning">
                            New Order
                    </button>
                    <button onClick={() => handleNewCustomerOrder({date: new Date().toLocaleString()})}
                        className="d-md-none navbar-brand pl-2 btn btn-warning">
                            <FaPlus />
                    </button>
                    <div className="input-group ">
                        <input type="text" className="form-control flex-grow-1" placeholder="Search orders..." 
                        aria-label="Recipient's username" aria-describedby="basic-addon2" />
                        <select className="input-group-text " aria-label="Filter Orders">
                            <option selected>All Orders</option>
                            <option value="1">In Progress</option>
                            <option value="2">Payment</option>
                            <option value="3">Receipt</option>
                        </select>
                    </div>
                </div>
                <div className="bg-light table-responsive-lg orders-display">
                    <table className="table table-striped table-hover ">
                        <thead>
                            <tr className="table-dark">
                                {tableDetails?.map((detail, i) =>(
                                    <th key={i} scope="col">{detail.header}</th>
                                ))
                                }
                                {
                                    listType === "ordering" && 
                                    <th scope="col">Action</th>
                                }
                            </tr>
                        </thead>
                        <tbody className="">
                            {
                                list.map((order, i) =>(
                                    <tr key={i} onClick={() => handleChangeActiveOrder(order)}
                                    className={`${order.activeOrder? "table-active" : " "}`}>
                                        {
                                            tableDetails?.map((detail, j) =>(
                                                <td key={i + j} className="text-capitalize">{order[detail.data]}</td>
                                            ))
                                        }
                                        {
                                            listType === "ordering" && 
                                            <td onClick={(e) => handleDeleteCustomerOrder(e, order)}>
                                                <button className=" btn btn-secondary btn-sm ms-1"  >
                                                    <FaDeleteLeft />
                                                </button>
                                            </td>
                                        }
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div className="d-flex  fixed-bottom">
                    {
                        listType === "ordering" && 
                        <button type="button" onClick={() => handleEntryStep()}
                        className="btn col-6 col-md-7 py-3 rounded-0 btn-warning">
                            <h5 className="mb-0"><b>Load Order</b></h5>
                        </button>
                    }
                    <button type="button" onClick={() => setShowReview(true)}
                    className="d-sm-none btn col-6 py-3 rounded-0 btn-info text-center">
                        <h5 className="mb-0"><b>Review</b></h5>
                    </button>
                </div>
            </div>
    )
}

export default DisplayList;