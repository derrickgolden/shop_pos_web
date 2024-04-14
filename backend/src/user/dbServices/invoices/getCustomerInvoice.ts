import { RowDataPacket } from "mysql2";
import { universalResponse } from "user/types/universalResponse";
const { pool } = require("../../../mysqlSetup");

export const getCustomerInvoiceDetails = async ( sale_id: string): Promise<universalResponse> => {  
    const connection: RowDataPacket = await pool.getConnection();
    try {

        var [res] = await connection.query(`
            SELECT 
                sales.sale_id,
                sales.sale_date,
                sales.balance,
                sales.payment_status,
                    JSON_OBJECTAGG(
                        COALESCE(sale_payments.payment_method, 'Not Paid'), 
                        COALESCE(sale_payments.amount, 0)
                    ) AS payment_details,
                customer_list.customer_id,
                customer_list.full_name,
                customer_list.email,
                customer_list.phone,
                invoices.invoice_id,
                invoices.invoice_date,
                invoices.updated_at
            FROM 
                sales
            LEFT JOIN 
                sale_payments ON sales.sale_id = sale_payments.sale_id
            INNER JOIN 
                customer_list ON sales.customer_id = customer_list.customer_id
            LEFT JOIN 
                invoices ON sales.sale_id = invoices.sale_id
            WHERE 
                sales.sale_id = COALESCE(?, sales.sale_id)
            GROUP BY 
                sales.sale_id,
                sales.sale_date,
                sales.balance,
                sales.payment_status,
                customer_list.customer_id,
                customer_list.full_name,
                customer_list.email,
                customer_list.phone,
                invoices.invoice_id,
                invoices.invoice_date,
                invoices.updated_at;
            `, [sale_id]);

        connection.release();

        return {
            success: true,
            msg: `Customer Invoice Details`,
            details: res
        };
    } catch (error) {
        console.error('Error:', error.message);
        connection.release();

        if (error.sqlMessage) {
            return { success: false, msg: "Error fetching invoice details", err: error.sqlMessage };
        } else {
            return { success: false, msg: "Error fetching invoice details", err: error.message };
        }
    }
};

module.exports = {
    getCustomerInvoiceDetails,
}