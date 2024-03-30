"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.getProductList = exports.addProduct = void 0;
const fs_1 = __importDefault(require("fs"));
const { pool } = require("../../../mysqlSetup");
const addProduct = async (productDetails, img_file) => {
    const { product_code, product_name, stock_qty, shop_id, instructions, side_effect, group_id, price, package_cost, package_size } = productDetails;
    const path = img_file?.filename || null;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        var [products] = await connection.query(`
                SELECT product_name FROM product_list
                WHERE shop_id = ?
            `, [shop_id]);
        const productExists = products.some(product => product.product_name === product_name);
        if (productExists) {
            if (img_file) {
                fs_1.default.unlink(img_file.path, (err) => {
                    if (err) {
                        console.error(`Error deleting file ${img_file.originalname}:`, err);
                    }
                });
            }
            return {
                success: false,
                msg: `${product_name} is already registered.`,
                details: []
            };
        }
        else {
            var [res] = await connection.query(`
                    INSERT INTO product_list (product_code, product_name, 
                        instructions, side_effect, group_id, img_path, shop_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [product_code, product_name, instructions, side_effect, group_id, path, shop_id]);
            const product_id = res.insertId;
            var [pricing_res] = await connection.query(`
                    INSERT INTO pricing (product_id, price, package_cost )
                    VALUES (?, ?, ?)
                `, [product_id, price, package_cost]);
            var [stock_res] = await connection.query(`
                    INSERT INTO stock (product_id, containers, units_per_container, 
                        open_container_units, warning_limit)
                    VALUES (?, ?, ?, ?, ?)
                `, [product_id, stock_qty, package_size, 0, 20]);
        }
        await connection.commit();
        connection.release();
        return {
            success: true,
            msg: `${product_name} has been Registered`,
            details: []
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
exports.addProduct = addProduct;
const getProductList = async (details) => {
    const { shop_id } = details;
    const connection = await pool.getConnection();
    try {
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
exports.getProductList = getProductList;
const deleteProduct = async (product_id) => {
    const connection = await pool.getConnection();
    try {
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
exports.deleteProduct = deleteProduct;
module.exports = {
    addProduct: exports.addProduct,
    getProductList: exports.getProductList,
    deleteProduct: exports.deleteProduct,
};
//# sourceMappingURL=productList.js.map