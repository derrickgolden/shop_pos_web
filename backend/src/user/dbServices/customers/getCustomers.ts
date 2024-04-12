
import { RowDataPacket } from "mysql2";
import { GetProductListProps } from "user/types/productDetails";
import { universalResponse } from "user/types/universalResponse";
const { pool } = require("../../../mysqlSetup");

export const getCustomerList = async ( details: GetProductListProps ): Promise<universalResponse> => {    
    const {shop_id} = details;
    
    const connection: RowDataPacket = await pool.getConnection();
    try {

        var [res] = await connection.query(`
            SELECT * FROM customer_list
            WHERE shop_id = ?
            `, [shop_id]);

        connection.release();

        return {
            success: true,
            msg: `Customer list`,
            details: res
        };
    } catch (error) {
        console.error('Error:', error.message);
        connection.release();

        if (error.sqlMessage) {
            return { success: false, msg: "Database Error", err: error.sqlMessage };
        } else {
            return { success: false, msg: "Database Error", err: error.message };
        }
    }
};
