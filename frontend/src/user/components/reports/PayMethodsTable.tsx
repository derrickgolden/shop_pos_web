import React from 'react';
import DataTable from 'react-data-table-component';
import { ShopState } from '../../../redux/activeShop';
import { mappedPaymentProps, paymentProps } from '../../pages/types';

interface salesItemProps{
    shop_id: number,
    shop_name: string,
    sales_item_id: number,
    sub_total: string,
    units_sold: number
}
export interface salesProps{
    sale_id: number,
    sale_date: Date,
    sales_items: salesItemProps[],
    total_price: string,
    cashier: {cashier_f_name: string, cashier_l_name: string, cashier_id: number},
}
export interface salesDataProps{
    paymentData: paymentProps[];
    activeShop : ShopState
}

const PayMethodTable: React.FC<salesDataProps> = ({ paymentData, activeShop }: salesDataProps) => {
    // Define columns for the main DataTable
    const columns = [
        { name: 'Sale ID', selector: (row: mappedPaymentProps) => row.sale_id, sortable: true },
        { name: 'Sale Date', selector: (row: mappedPaymentProps) => row.sale_date, sortable: true },
        { name: 'Payment Method', selector: (row: mappedPaymentProps) => {
            return row.payment_methods.map(method => method.payment_method).join(', ');
        }, sortable: true},
        { name: 'Amount Purchased', selector: (row: mappedPaymentProps) => row.total_price, sortable: true },
        { name: 'Amount Paid', selector: (row: mappedPaymentProps) => {
            return row.payment_methods.map(method => method.amount).join(', ');
        }, sortable: true },
    ];

  // Map the sales data to match the main DataTable structure
    const mappedData = paymentData?.map((sale) => ({
        id: sale.sale_id,
        sale_id: sale.sale_id,
        sale_date: new Date(sale.sale_date).toLocaleString(),
        total_price: `Ksh. ${parseFloat(sale.total_price).toFixed(2)}`,
        payment_methods: sale.payment_methods,
    }));

    return (
        <div className="container-fluid px-md-5" >
            <div className="row my-3">
                <div className="col-12">
                    <div className="card" style={{ borderTop: "2px solid #4723d9" }}>
                        <div className="card-header d-flex justify-content-between border-bottom pb-1">
                            <h4>Payment methods data</h4>
                            {/* <select value={search} onChange={handleSearchChange}>
                                <option value="shop_name">Product Name</option>
                                <option value="group_name">Product Group</option>
                                <option value="shop_id">Product Id</option>
                            </select> */}
                        </div>
                        <div className="card-body">
                            {activeShop?.shop ? 
                            <div className="table-responsive ">
                                <DataTable
                                    columns={columns}
                                    data={mappedData}
                                    pagination
                                    highlightOnHover
                                    striped
                                />
                            </div>
                            :
                            <h1>Select a shop first</h1>
                            }  
                        </div>
                    </div>
                </div>
            </div>
        </div>  
  );
};

export default PayMethodTable;

