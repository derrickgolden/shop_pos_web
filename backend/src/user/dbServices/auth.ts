import { DBServicesRes, GoogleUserProfile, LinkTokenRes, LoginMysqlRes, 
    LoginResponse, SignupDetails, SignupResponse } from "user/type";
import { RowDataPacket } from 'mysql2/promise';
var bcrypt = require('bcryptjs');

const { pool } = require("../../mysqlSetup");

export interface StoreLinkTokenRes extends DBServicesRes{
    details?:[{
        link_tokens_id: number, user_id: number, email: string
    }]
}

interface GoogleUserProfileAdd extends GoogleUserProfile{
    last_name: string,
    first_name: string
}

const signupUser = async (signupDetails: SignupDetails | GoogleUserProfileAdd, 
    auth_with: string): Promise<SignupResponse> => {

    const {email} = signupDetails;
    const connection: RowDataPacket = await pool.getConnection();
    try {

        // Check if the user already exists
        const [existingUser] = await connection.query(`
            SELECT * FROM user_details
            WHERE email = ? 
        `, [email]);

        if (existingUser.length > 0) {
            connection.release();
            return { success: true, rejectInput: "email", msg: "Email already registered, please log in" };
        }
        
        // Insert user details
        if(auth_with === "app" && "phone" in signupDetails){
            var {first_name, last_name, remember_me, country, hash, admin_email, phone, user_type, admin_pass} = signupDetails

            if(user_type === "owner"){
                var [insertUser] = await connection.query(`
                    INSERT INTO user_details (first_name, last_name, email, remember_me, country, password, phone, position)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `, [first_name, last_name, email, remember_me, country, hash, phone, user_type]);
                
                const user_id: number = insertUser.insertId;
                var [insertUser] = await connection.query(`
                    UPDATE user_details
                    SET added_by = ?
                    WHERE user_id = ?
                `, [user_id, user_id]);
            }else{
                // Confirm owner Details
                const [getOwner] = await connection.query(`
                    SELECT * FROM user_details
                    WHERE email = ? 
                `, [admin_email]);
                
                if (getOwner.length <= 0) {
                    connection.release();
                    return { success: true, rejectInput: "email", msg: "Email Owner does not exist" };
                    
                }else if(getOwner.length === 1){
                    const {user_id, password: passwordHash} = getOwner[0];
                    const match: boolean = await bcrypt.compare(admin_pass, passwordHash);
                    if(match) {
                        var [insertUser] = await connection.query(`
                        INSERT INTO user_details (first_name, last_name, email, remember_me, country, password, phone, added_by, position)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `, [first_name, last_name, email, remember_me, country, hash, phone, user_id, user_type]);
                        
                    }else{
                        return { success: true, rejectInput: "Password", msg: "Owner password is incorrect" };
                    }
                }
            }
        }
        // else if(auth_with === "google" && "picture" in signupDetails){
        //     console.log("Inserting with google");
        //     var {first_name, last_name, picture, id} = signupDetails;
        //     var [insertUser] = await connection.query(`
        //         INSERT INTO user_details (first_name, last_name, email, picture, google_id)
        //         VALUES (?, ?, ?, ?, ?)
        //     `, [first_name, last_name, email, picture, id]);
        // }

        connection.release();

        const userId: number = insertUser.insertId;
        return {
            success: true,
            admin_id: userId,
            msg: "User Registered",
            details: [{ first_name, last_name, email, remember_me, country }]
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

const loginUser = async(email: string, ): Promise<LoginResponse> => {

    const connection: RowDataPacket = await pool.getConnection();
    try {

        const [res]: [Array<LoginMysqlRes>] = await connection.query(`
            SELECT * FROM user_details
            WHERE email = ?
        `, [email]);

        connection.release();

        if(res.length === 1){
            const {user_id, first_name, last_name, email, remember_me, country, password, 
                total_deposit, total_withdraw, balance, picture, added_by} = res[0]
                
            return {userAvailable: true, passwordHash: password,
                details: [{user_id, first_name, last_name, email, remember_me, country, 
                    total_deposit, total_withdraw, balance, picture, added_by}]
            };
        }else{
            return {userAvailable: false}
        }
    } catch (error) {
        console.log(error)
        connection.release();

        if (error.sqlMessage) {
            return {userAvailable: false,
                res:{success: false,  msg: error.sqlMessage} };
          } else {
            return {userAvailable: false,
                res:{success: false, msg: error.message }};
        }
    }
}

const resetPassword = async(password:string, email: string
                        ): Promise<DBServicesRes> =>{
                            
    const connection: RowDataPacket = await pool.getConnection();
    try {

        const [res]: [{affectedRows: number}] = await connection.query(`
        UPDATE user_details 
        SET password = ?
        WHERE email = ?;
        `, [password, email])

        connection.release();
        
        if(res.affectedRows === 1){
            return {success: true, msg: "pasword update successful"}
        }else{
            return {success: false, msg: "password not updated, email maybe unavailable"}
        }
    } catch (error) {
        console.log(error)
        connection.release();

        if (error.sqlMessage) {
            return { success: false, msg: error.sqlMessage };
          } else {
            console.error('Error:', error.message);
            return { success: false, msg: error.message };
          }
    }
}

const storeLinkToken = async( user_id: number, email: string, token: string
                        ): Promise<StoreLinkTokenRes> => {

    const connection: RowDataPacket = await pool.getConnection();
    try {

        const [res]: [{insertId: number}] = await connection.query(`
        INSERT INTO link_tokens (user_id, email, token)
        VALUES (?, ?, ?)
        `, [user_id, email, token,]);

        connection.release();

        return {success: true, msg: "",
            details: [{link_tokens_id:res.insertId, user_id, email}]
        };
    } catch (error) {
        console.log(error)
        connection.release();

        if (error.sqlMessage) {
            return { success: false, msg: error.sqlMessage };
          } else {
            console.error('Error:', error.message);
            return { success: false, msg: error.message };
          }
    }
}

const getLinkToken = async(token: string ): Promise<LinkTokenRes> => {

    const connection: RowDataPacket = await pool.getConnection();
    try {

        const [res]:[Array<
            {user_id: number, email: string, token: string, create_time: Date}
            >] = await connection.query(`
        SELECT * FROM link_tokens
        WHERE token = ?
        `, [token]);

        connection.release();
        
        if(res.length === 1 && token === res[0].token){
            const {user_id, email, create_time} = res[0]

            const currentDateTime = create_time;
            currentDateTime.setHours(currentDateTime.getHours() + 3);
            if(currentDateTime < new Date()){
                return {success: false, msg: "Link Expired"}
            }   
            return {success: true, email, user_id, msg: ""};
        }else{
            return {success: false, msg: "Link Invalid"}
        }
    } catch (error) {
        console.log(error)
        connection.release();
        
        if (error.sqlMessage) {
            return {success: false,  msg: error.sqlMessage };
          } else {
            return {success: false, msg: error.message };
        }
    }
}

module.exports = {
    signupUser,
    loginUser,
    // loginAdmin,
    resetPassword,
    storeLinkToken,
    getLinkToken,
}