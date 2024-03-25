"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftProductGroup = exports.getProductGroups = exports.updateProductDetails = exports.addProductGroup = void 0;
const { pool } = require("../../../mysqlSetup");
const addProductGroup = async (productgroupDetails) => {
    const { group_name, description, shop_id } = productgroupDetails;
    const connection = await pool.getConnection();
    try {
        var [res] = await connection.query(`
                INSERT INTO product_group (group_name, description, shop_id)
                VALUES (?, ?, ?)
            `, [group_name, description, shop_id]);
        connection.release();
        return {
            success: true,
            msg: `Product Group ${group_name} Registered`,
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
exports.addProductGroup = addProductGroup;
const updateProductDetails = async (productgroupDetails) => {
    const { product_id, warning_limit, product_name } = productgroupDetails;
    const connection = await pool.getConnection();
    try {
        var [res] = await connection.query(`
                UPDATE stock 
                SET warning_limit = ?
                WHERE product_id = ?
            `, [warning_limit, product_id]);
        var [name_res] = await connection.query(`
                UPDATE product_list 
                SET product_name = ?
                WHERE product_id = ?
            `, [product_name, product_id]);
        connection.release();
        if (res.affectedRows > 0 || name_res.affectedRows > 0) {
            return {
                err: false,
                success: true,
                msg: `Product details updated`,
                details: res
            };
        }
        else {
            return {
                err: false,
                success: false,
                msg: `No rows were updated. Product not found.`,
                details: res
            };
        }
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
exports.updateProductDetails = updateProductDetails;
const getProductGroups = async (filterNull, shop_id) => {
    const connection = await pool.getConnection();
    try {
        // Organize SQL query for better readability
        const query = `
        SELECT
            mg.group_id,
            mg.group_name,
            mg.description,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'product_id', ml.product_id,
                    'product_code', ml.product_code,
                    'product_name', ml.product_name,
                    'instructions', ml.instructions,
                    'side_effect', ml.side_effect,
                    'img_path', ml.img_path,
                    'pricing_id', p.pricing_id,
                    'price', p.price,
                    'package_cost', p.package_cost,
                    'stock_qty', s.containers,
                    'package_size', s.units_per_container,
                    'open_container_units', s.open_container_units
                )
            ) AS products
        FROM
            product_group mg
        LEFT JOIN
            product_list ml ON mg.group_id = ml.group_id
        LEFT JOIN
            pricing p ON ml.product_id = p.product_id
        LEFT JOIN
            stock s ON ml.product_id = s.product_id
        WHERE
            ${filterNull ? "ml.product_id IS NOT NULL AND" : ""}
            mg.shop_id = ?
        GROUP BY
            mg.group_id, mg.group_name, mg.description;
        `;
        const [res] = await connection.query(query, [shop_id]);
        connection.release();
        return {
            success: true,
            msg: `Product Group list`,
            details: res,
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
exports.getProductGroups = getProductGroups;
const shiftProductGroup = async (productgroupDetails) => {
    const { product_id, group_id } = productgroupDetails;
    const connection = await pool.getConnection();
    try {
        var [res] = await connection.query(`
                UPDATE product_list 
                SET group_id = ?
                WHERE product_id = ?
            `, [group_id, product_id]);
        connection.release();
        if (res.affectedRows > 0) {
            return {
                err: false,
                success: true,
                msg: `Group has been shifted`,
                details: res
            };
        }
        else {
            return {
                err: false,
                success: false,
                msg: `No rows were updated. Product not found.`,
                details: res
            };
        }
    }
    catch (error) {
        console.error('Error: ', error);
        connection.release();
        if (error.sqlMessage) {
            return { success: false, msg: error.sqlMessage };
        }
        else {
            return { success: false, msg: error.message };
        }
    }
};
exports.shiftProductGroup = shiftProductGroup;
module.exports = {
    addProductGroup: exports.addProductGroup,
    getProductGroups: exports.getProductGroups,
    updateProductDetails: exports.updateProductDetails,
    shiftProductGroup: exports.shiftProductGroup
};
//# sourceMappingURL=productGroup.js.map