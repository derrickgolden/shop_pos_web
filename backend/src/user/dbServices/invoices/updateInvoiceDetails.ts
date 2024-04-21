import { RowDataPacket } from "mysql2";
import { universalResponse } from "user/types/universalResponse";
import { UpdateInvoiceProps } from "../types";
const { pool } = require("../../../mysqlSetup");

export const upadateInvoiceDetails = async (newDetails: UpdateInvoiceProps  ): Promise<universalResponse> => {

    const {sale_id, remaining, customerGave, change, payment_status} = newDetails;

    const connection: RowDataPacket = await pool.getConnection();
    try {

        await connection.beginTransaction();
            // update sales
            var [res] = await connection.query(`
                UPDATE sales 
                SET balance = ?, change_amount = ?, payment_status = ? 
                WHERE sale_id = ?
            `, [ remaining, change, payment_status, sale_id]);

            if (res.affectedRows > 0) {
                // insert paymentMethods
                Object.entries(customerGave).map( async([key, value]) =>{
                    var [paymentMethods_res] = await connection.query(`
                        INSERT INTO sale_payments (sale_id, payment_method, amount)
                        VALUES (?, ?, ?)
                    `, [sale_id, key, value]);
                    console.log(paymentMethods_res)
                })
            }else{
                return { success: false, msg: `Updated unsuccessful`};
            }
        await connection.commit();

        connection.release();

        return {
            success: true,
            msg: `Invoice has been updated`,
            details: [{sale_id }]
        };
    } catch (error) {
        console.error('Error:', error.message);
        connection.release();
        
        if (error.sqlMessage) {
            return { success: false, msg: error.sqlMessage };
        } else {
            return { success: false, msg: error.message };
        }
    }
};

module.exports = {
    upadateInvoiceDetails,
}