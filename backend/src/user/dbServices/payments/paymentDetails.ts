import { RowDataPacket } from "mysql2";
import { paymentDetailsProps } from "user/types/customerTypes";
import { universalResponse } from "user/types/universalResponse";
const { pool } = require("../../../mysqlSetup");

export const addPaymentDetails = async (body: paymentDetailsProps ): Promise<universalResponse> => {

    const {payment_name, paymentDetails, shop_id} = body;
    const details = JSON.stringify(paymentDetails);

    const connection: RowDataPacket = await pool.getConnection();
    try {

        await connection.beginTransaction();

        var [res] = await connection.query(`
            INSERT INTO payment_details (payment_name, details, shop_id)
            VALUES (?, ?, ?)
        `, [payment_name, details, shop_id]);
           
        await connection.commit();

        connection.release();

        return {
            success: true,
            msg: `${payment_name} has been Registered`,
            details: []
        };
    } catch (error) {
        console.error('Error:', error.message);
        connection.release();
        if (error.sqlMessage) {
            return { success: false, msg: error.sqlMessage  };
        } else {
            return { success: false, msg: "Error while adding customer", err: error.message };
        }
    }
};

export const getPaymentDetails = async (body: paymentDetailsProps ): Promise<universalResponse> => {

    const {shop_id} = body;

    const connection: RowDataPacket = await pool.getConnection();
    try {

        var [res] = await connection.query(`
            SELECT * FROM payment_details
            WHERE shop_id = ?
        `, [shop_id]);
           
        connection.release();

        return {
            success: true,
            msg: `Payment Details`,
            details: res
        };
    } catch (error) {
        console.error('Error:', error.message);
        connection.release();
        if (error.sqlMessage) {
            return { success: false, msg: error.sqlMessage  };
        } else {
            return { success: false, msg: "Error while fetching payment details", err: error.message };
        }
    }
};

module.exports = {
    addPaymentDetails,
    getPaymentDetails
}