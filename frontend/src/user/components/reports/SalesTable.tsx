import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ShopState } from '../../../redux/activeShop';
import { getStatusColor } from './styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import UpdateInvoice from './UpdateInvoice';
import { columnsProps, subColumnsProps } from './types';
import { SalesApiData } from '../../../redux/salesReport';

export interface SalesDataProps{
    salesData: SalesApiData[];
    activeShop: ShopState;
}

interface mappedDataProps{
    data: columnsProps;
}

const SalesTable: React.FC<SalesDataProps> = ({ salesData, activeShop }) => {
//   console.log(salesData)
    const [saleRowData, setSaleRowData] = useState<columnsProps>();

    // Define columns for the main DataTable
  const columns = [
    { name: 'Sale ID', selector: (row: columnsProps) => row.sale_id, sortable: true },
    { name: 'Sale Date', selector: (row: columnsProps) => row.sale_date, sortable: true },
    { name: 'Total Price', selector: (row: columnsProps) => row.total_price, sortable: true },
    { name: 'Total Profit', selector: (row: columnsProps) => row.total_profit, sortable: true },
    { name: 'Cashier Name', selector: (row: columnsProps) => row.cashier.cashier_f_name, sortable: true },
    { name: 'Status', selector: (row: columnsProps) => row.payment_status, sortable: true,
    cell: (row : columnsProps) => 
        <div className={`${ getStatusColor(row.payment_status).text }`}>
            {row.payment_status}
        </div>
     },
     { name: 'Action',  cell: (row: columnsProps) => (
        <button type='button' onClick={() => handleActionClick(row)} 
            disabled = {row.balance === "0.00"? true: false}
            data-bs-toggle="modal" data-bs-target="#updateInvoiceModal"
        className={`btn ${ getStatusColor(row.payment_status).btn } btn-sm`}>
           <FontAwesomeIcon icon={faPenToSquare} />
        </button>
      ),
       },
  ];

  // Define columns for the nested DataTable (Sales Items)
  const subColumns = [
    { name: 'Sales Item ID', selector: (row: subColumnsProps) => row.sales_item_id, sortable: true },
    { name: 'Product ID', selector: (row: subColumnsProps) => row.product_id, sortable: true },
    { name: 'Product Name', selector: (row: subColumnsProps) => row.product_name, sortable: true },
    { name: 'Units Sold', selector: (row: subColumnsProps) => row.units_sold, sortable: true },
    { name: 'Sub Total', selector: (row: subColumnsProps) => row.sub_total, sortable: true },
    { name: 'Profit', selector: (row: subColumnsProps) => row.profit, sortable: true },
  ];

  // Map the sales data to match the main DataTable structure
    const mappedData = salesData?.map((sale) => {
        const {cashier,payment_status,sale_date,sale_id,sales_items,total_price,total_profit,balance,customer_id} = sale
        return({
            id: sale_id, 
            sale_id,
            customer_id,
            sale_date: new Date(sale_date).toLocaleString(),
            total_price: `Ksh. ${parseFloat(total_price).toFixed(2)}`,
            total_profit: `Ksh. ${parseFloat(total_profit).toFixed(2)}`,
            balance,
            cashier, 
            payment_status,
            children: sales_items.map((item) => ({
                ...item,
                sub_total: `Ksh. ${(item.sub_total).toFixed(2)}`,
            id: `${sale_id}-${item.sales_item_id}`, // Unique identifier for each row
            })),
        })
    });

    const handleActionClick = (row: columnsProps) =>{
        console.log(row)
        setSaleRowData(row);
    }
    // const nestData = mappedData?.children
    const ExpandedComponent = ({data}: mappedDataProps) => {
        return(
            <div className="card " style={{border: "1px solid #91becc", borderTop: "2px solid #3aaed1" }}>
                <div className="card-header d-flex justify-content-between border-bottom pb-1">
                    <h6>Details</h6>   
                </div>
                <div className="card-body pt-0">
                    {mappedData.length ? <div className="table-responsive ">
                    <DataTable
                        columns={subColumns}
                        data={data.children}
                        highlightOnHover
                    />
                </div>
                    :
                    <h1>No data to show</h1>
                    }  
                </div>
            </div>          
        );
    };

  return (
    <div className="container-fluid px-md-5" >
        <div className="row my-3">
            <div className="col-12">
                <div className="card" style={{ borderTop: "2px solid #4723d9" }}>
                    <div className="card-header d-flex justify-content-between border-bottom pb-1">
                        <h4>Sales Data</h4>
                        {/* <select value={search} onChange={handleSearchChange}>
                            <option value="product_name">Product Name</option>
                            <option value="group_name">Product Group</option>
                            <option value="product_id">Product Id</option>
                        </select> */}
                    </div>
                    <div className="card-body">
                        {activeShop?.shop? 
                            (<div className="table-responsive ">
                                <DataTable
                                    columns={columns}
                                    data={mappedData}
                                    pagination
                                    expandableRows
                                    expandOnRowClicked
                                    expandableRowsComponent={ExpandedComponent}
                                    highlightOnHover
                                    striped
                                />
                            </div>) :   (
                            <h1>Select a shop first</h1>
                            )
                        }  
                    </div>
                </div>
            </div>
        </div>
        {
           saleRowData &&  
            <UpdateInvoice 
                sale = {saleRowData}
            />
        }
    </div>   
  );
};

export default SalesTable;

