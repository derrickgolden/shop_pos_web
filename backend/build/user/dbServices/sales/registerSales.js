"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSales = void 0;
const { pool } = require("../../../mysqlSetup");
const registerSales = async (saleDetails, user_id) => {
    const { orderDetails, totalPrice, moneyTrans, updateStock, shop_id, total_profit } = saleDetails;
    // console.log(sale_date);
    const sale_date = new Date();
    const connection = await pool.getConnection();
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
        const { customerGave, change } = moneyTrans;
        var [res] = await connection.query(`
                INSERT INTO sales (sale_date, total_price, total_profit, change_amount, cashier, shop_id)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [sale_date, totalPrice, total_profit, change, user_id, shop_id]);
        const sale_id = res.insertId;
        orderDetails.map(async (details) => {
            const { product_id, units, sub_total, profit } = details;
            var [pricing_res] = await connection.query(`
                    INSERT INTO sales_items (sale_id, product_id, units_sold, sub_total, profit)
                    VALUES (?, ?, ?, ?, ?)
                `, [sale_id, product_id, units, sub_total, profit]);
        });
        // insert paymentMethods
        Object.entries(customerGave).map(async ([key, value]) => {
            var [paymentMethods_res] = await connection.query(`
                    INSERT INTO sale_payments (sale_id, payment_method, amount)
                    VALUES (?, ?, ?)
                `, [sale_id, key, value]);
        });
        // update stock
        updateStock.map(async (details) => {
            const { product_id, remainingContainers, remainingUnits } = details;
            var [stock_res] = await connection.query(`
                    UPDATE stock 
                    SET  containers = ?, open_container_units = ?
                    WHERE product_id = ?
                `, [remainingContainers, remainingUnits, product_id]);
        });
        await connection.commit();
        connection.release();
        return {
            success: true,
            msg: `sale has been Registered`,
            details: [{ sale_id, sale_date, ...moneyTrans }]
        };
    }
    catch (error) {
        console.error('Error:', error.message);
        connection.release();
        if (error.sqlMessage) {
            return { success: false, msg: error.sqlMessage };
        }
        else {
            return { success: false, msg: error.message };
        }
    }
};
exports.registerSales = registerSales;
module.exports = {
    registerSales: exports.registerSales,
};
//# sourceMappingURL=registerSales.js.map