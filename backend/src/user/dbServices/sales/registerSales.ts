import { RowDataPacket } from "mysql2";
import { universalResponse } from "user/types/universalResponse";
import { RegisterSalesProp } from "../types";
const { pool } = require("../../../mysqlSetup");

export const registerSales = async (saleDetails: RegisterSalesProp, user_id: number ): Promise<universalResponse> => {

    const {orderDetails, totalPrice, moneyTrans, updateStock, shop_id, total_profit, invoiceDetails} = saleDetails;

    const sale_date = new Date()

    const connection: RowDataPacket = await pool.getConnection();
    try {

        await connection.beginTransaction();

            // var [update_res] = await connection.query(`
            //     SELECT * FROM update_online
            //     WHERE update_flag = ?
            // `, [true]);
            
            // if(update_res.length === 0){
            //     var [update] = await connection.query(`
            //         INSERT INTO update_online (update_flag, start_date)
            //         VALUES (?, ?)
            //     `, [true, sale_date]);
            // }

            // Insert sales
            const {customerGave, change, remaining, payment_status} = moneyTrans;
            const { sendInvoice, customer_id } = invoiceDetails;
            var [res] = await connection.query(`
                INSERT INTO sales (sale_date, total_price, total_profit, balance, change_amount, cashier, shop_id, payment_status, customer_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [sale_date, totalPrice, total_profit, remaining, change, user_id, shop_id, payment_status, customer_id]);

            const sale_id = res.insertId;

            orderDetails.map( async(details) =>{
                const { product_id, units, sub_total, profit, price, discount } = details;
                var [pricing_res] = await connection.query(`
                    INSERT INTO sales_items (sale_id, product_id, price, units_sold, sub_total, profit, discount)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [sale_id, product_id, price, units, sub_total, profit, discount]);
            });

            // insert invoice if available 
            if(sendInvoice){
                const invoice_date = new Date();
                var [invoice_res] = await connection.query(`
                    INSERT INTO invoices (sale_id, customer_id, invoice_date)
                    VALUES (?, ?, ? )
                `, [sale_id, customer_id, invoice_date]);

                var invoice_id = invoice_res.insertId;
            }
            
            // insert paymentMethods
            Object.entries(customerGave).map( async([key, value]) =>{
                var [paymentMethods_res] = await connection.query(`
                    INSERT INTO sale_payments (sale_id, payment_method, amount)
                    VALUES (?, ?, ?)
                `, [sale_id, key, value]);
            })

            // update stock
            updateStock.map( async(details) =>{
                const { product_id, remainingContainers, remainingUnits } = details;
                var [stock_res] = await connection.query(`
                    UPDATE stock 
                    SET  containers = ?, open_container_units = ?
                    WHERE product_id = ?
                `, [remainingContainers, remainingUnits, product_id]);
            })
                
        await connection.commit();

        connection.release();

        return {
            success: true,
            msg: `sale has been Registered`,
            details: [{sale_id, sale_date, ...moneyTrans, invoice_id, orderDetails}]
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
    registerSales,
}