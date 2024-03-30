"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalesReport = void 0;
const { pool } = require("../../../mysqlSetup");
const getSalesReport = async (shop_id) => {
    const connection = await pool.getConnection();
    try {
        var [res] = await connection.query(`
            SELECT
                s.sale_id,
                s.sale_date,
                s.total_price,
                s.total_profit,
                'cashier',
                JSON_OBJECT(
                    'cashier_f_name', ud.first_name,
                    'cashier_l_name', ud.last_name,
                    'cashier_id', s.cashier
                ) As cashier,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'sales_item_id', si.sales_item_id,
                        'product_id', si.product_id,
                        'product_name', pl.product_name,
                        'units_sold', si.units_sold,
                        'sub_total', si.sub_total,
                        'profit', si.profit
                    )
                ) AS sales_items
            FROM
                sales s
            JOIN
                user_details ud ON s.cashier = ud.user_id
            JOIN
                sales_items si ON s.sale_id = si.sale_id
            JOIN
                product_list pl ON si.product_id = pl.product_id -- Join with product_list table
            WHERE s.shop_id = ?
            GROUP BY
                s.sale_id, s.sale_date, s.total_price
            ORDER BY sale_id DESC;

            `, [shop_id]);
        connection.release();
        return {
            success: true,
            msg: `Sales Report`,
            details: res
        };
    }
    catch (error) {
        console.error('Error:', error.message);
        connection.release();
        if (error.sqlMessage) {
            return { success: false, msg: "Database Error", err: error.sqlMessage };
        }
        else {
            return { success: false, msg: "Database Error", err: error.message };
        }
    }
};
exports.getSalesReport = getSalesReport;
module.exports = {
    getSalesReport: exports.getSalesReport,
};
//# sourceMappingURL=getSalesReport.js.map