import { RowDataPacket } from "mysql2";
import { GetProductListProps, productDetailsProps } from "user/types/productDetails";
import { universalResponse } from "user/types/universalResponse";
const { pool } = require("../../../mysqlSetup");

export const addProduct = async (productDetails: productDetailsProps, img_file: Express.Multer.File ): Promise<universalResponse> => {
    
    const {product_code, product_name, stock_qty, shop_id,
    instructions, side_effect, group_id, price, unit_of_mesurement, package_size} = productDetails;

    const path = img_file?.path || null
    
    try {
        const connection: RowDataPacket = await pool.getConnection();

        await connection.beginTransaction();

            var [res] = await connection.query(`
                INSERT INTO product_list (product_code, product_name, 
                    instructions, side_effect, group_id, img_path, shop_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [product_code, product_name, instructions, side_effect, group_id, path, shop_id]);
                
            const product_id = res.insertId;
                
            var [pricing_res] = await connection.query(`
                INSERT INTO pricing (product_id, price, unit_of_measurement )
                VALUES (?, ?, ?)
            `, [product_id, price, unit_of_mesurement]);

            var [stock_res] = await connection.query(`
                INSERT INTO stock (product_id, containers, units_per_container, 
                    open_container_units, warning_limit)
                VALUES (?, ?, ?, ?, ?)
            `, [product_id, stock_qty, package_size, 0, 20]);

        await connection.commit();

        connection.release();

        return {
            success: true,
            msg: `${product_name} has been Registered`,
            details: []
        };
    } catch (error) {
        console.error('Error:', error.message);

        if (error.sqlMessage) {
            return { success: false, msg: error.sqlMessage };
        } else {
            return { success: false, msg: error.message };
        }
    }
};

export const getProductList = async ( details: GetProductListProps ): Promise<universalResponse> => {    
    const {shop_id} = details;
    
    try {
        const connection: RowDataPacket = await pool.getConnection();

        var [res] = await connection.query(`
            SELECT
                ml.product_id,
                ml.product_code,
                ml.product_name,
                ml.instructions,
                ml.side_effect,
                ml.img_path,
                mg.group_id,
                mg.group_name,
                mg.description,
                s.containers AS stock_qty,
                s.units_per_container,
                s.open_container_units,
                s.last_stocked,
                s.warning_limit
            FROM
                product_list ml
            JOIN
                product_group mg ON ml.group_id = mg.group_id
            LEFT JOIN
                stock s ON ml.product_id = s.product_id
            WHERE mg.shop_id = ?
            `, [shop_id]);

        connection.release();

        return {
            success: true,
            msg: `Product list`,
            details: res
        };
    } catch (error) {
        console.error('Error:', error.message);

        if (error.sqlMessage) {
            return { success: false, msg: "Database Error", err: error.sqlMessage };
        } else {
            return { success: false, msg: "Database Error", err: error.message };
        }
    }
};

export const deleteProduct = async (product_id: number ): Promise<universalResponse> => {    
    try {
        const connection: RowDataPacket = await pool.getConnection();

            var [res] = await connection.query(`
                DELETE FROM product_list
                WHERE product_id = ?;
            `, [product_id]);

        connection.release();

        return {
            success: true,
            msg: `Product deleted`,
            details: res
        };
    } catch (error) {
        console.error('Error:', error.message);

        if (error.sqlMessage) {
            return { success: false, msg: "Database Error", err: error.sqlMessage };
        } else {
            return { success: false, msg: "Database Error", err: error.message };
        }
    }
};

module.exports = {
    addProduct,
    getProductList,
    deleteProduct,
}