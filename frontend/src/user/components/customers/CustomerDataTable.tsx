import { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { Customer, CustomerDataTableProps } from './types'

const CustomerDataTable: React.FC<CustomerDataTableProps> = ({ apidata, columns, search }) =>{
  const [data, setData] = useState(apidata as Customer[])
  const [datafilter, setFilter] = useState('')
  const [datafinals, setFinals] = useState(apidata as Customer[])

  useEffect(() => {
    let result: Customer[]= data?.filter((val ) => {      
      if (search == 'full_name') {
        return val.full_name?.toLowerCase().match(datafilter?.toLowerCase())
      }
      else if (search == 'phone') {
        return val.phone?.toLowerCase().match(datafilter?.toLowerCase())
      }
      else if (search == 'email') {
        return val.email?.toLowerCase().match(datafilter?.toLowerCase())
      }
      else if (search == 'customer_id') {
        return val.customer_id?.toString().match(datafilter?.toString())
      }
    });

    setFinals(result)

  }, [datafilter])

  useEffect(() => {
    setFinals(apidata)
    setData(apidata)
  }, [apidata])



  return (
    <>

      <div className="table-responsive ">
        <DataTable
          columns={columns}
          data={datafinals}
          pagination
          fixedHeader
          highlightOnHover
          responsive
          subHeader
          noHeader
          subHeaderComponent={
            <div className="row justify-content-start">
              <div className="col-12">
                <input type="text" placeholder={`search with ${search}`} className="form-control " 
                  value={datafilter} onChange={(e) => setFilter(e.target.value)} 
                />
              </div>
            </div>
           }
        />
      </div>
    </>
  )
}

export default CustomerDataTable;
