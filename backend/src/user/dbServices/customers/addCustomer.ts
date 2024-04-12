import { RowDataPacket } from "mysql2";
import { customerDataProps } from "user/types/customerTypes";
import { universalResponse } from "user/types/universalResponse";
const { pool } = require("../../../mysqlSetup");

interface CustomerProp {
    full_name: string;
};

export const addCustomer = async (customerDetails: customerDataProps ): Promise<universalResponse> => {

    const { full_name, email, country, phone, address, shop_id } = customerDetails;
    const connection: RowDataPacket = await pool.getConnection();
    try {

        await connection.beginTransaction();

            var [customers]: [CustomerProp[]] = await connection.query(`
                SELECT full_name FROM customer_list
                WHERE shop_id = ?
            `, [shop_id]);

            const customerExists = customers.some(customer => customer.full_name === full_name);

            if (customerExists) {
                return {
                    success: false,
                    msg: `${full_name} is already registered.`,
                    details: []
                };
            } else {
                var [res] = await connection.query(`
                    INSERT INTO customer_list (full_name, email, country, phone, address, shop_id)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [full_name, email, country, phone, address, shop_id]);
            }

        await connection.commit();

        connection.release();

        return {
            success: true,
            msg: `${full_name} has been Registered`,
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

module.exports = {addCustomer}