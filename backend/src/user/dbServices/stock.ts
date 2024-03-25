import { RowDataPacket } from "mysql2";
import { universalResponse } from "user/types/universalResponse";
import { RegisterShopProps } from "./types";
const { pool } = require("../../mysqlSetup");

export const getStockDetails = async (user_id: number, shop_id: number) => {

    const connection: RowDataPacket = await pool.getConnection();
    try {

            var [res] = await connection.query(`
                SELECT product_list.product_name, stock.*
                FROM product_list
                JOIN stock ON product_list.product_id = stock.product_id
                WHERE product_list.shop_id = ?;
            `, [shop_id]);
                
        connection.release();

        return {
            success: true,
            msg: `Stock details`,
            details: res
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

export const updateStockDetails = async (newStockDetails: {totalStock: number, product_id: number}) => {
    const {totalStock, product_id} = newStockDetails;

    const connection: RowDataPacket = await pool.getConnection();
    try {

            var [res] = await connection.query(`
                UPDATE stock 
                SET containers = ?
                WHERE product_id = ?
            `, [totalStock, product_id]);
                
        connection.release();

        if (res.affectedRows > 0) {
            return {
                err: false,
                success: true,
                msg: `Stock details updated`,
                details: res
            };
        } else {
              return {
                err: false,
                  success: false,
                  msg: `No rows were updated. Product not found.`,
                  details: res
              };
          }

    } catch (error) {
        console.error('Error:', error.message);
        connection.release();

        if (error.sqlMessage) {
            return { err: true, success: false, msg: error.sqlMessage };
        } else {
            return { err: true, success: false, msg: error.message };
        }
    }
};

module.exports = {
    getStockDetails,
    updateStockDetails
}