import express, {Request, Response} from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import multer from 'multer'
import path from 'path';
import fs from 'fs';

require('dotenv').config();

import adminauth from './user/routes/auth'
import productGroup from './user/routes/inventory/productGroup'
import productList from './user/routes/inventory/productList'
import sales from './user/routes/sales/registerSales'
import report from './user/routes/sales/getSalesReport'
import shop from './user/routes/shop'
import stock from './user/routes/stock'
import paymentMethod from './user/routes/payments/getPayMethodsReport'

import {authenticateToken} from './user/middlewares/authenticateToken';

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        // console.log("destination", file);

        const absolutePath = path.resolve(__dirname, 'uploads');
        if (!fs.existsSync(absolutePath)) {
          fs.mkdirSync(absolutePath, { recursive: true });
        }
        callback(null, absolutePath);
        // callback(null, "uploads");
    },
    filename: (req, file, callback) => {
        // console.log("file", file);
        
      callback(null, Date.now() + '-' + file.originalname);
    },
  });

const upload = multer({ storage: storage });

const app = express();
// app.use(cors());
app.use(cors({origin: ["https://shoppos.netlify.app", "http://localhost:5173"]}))
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(compression())
app.use(cookieParser())

const port = process.env.SEVERPORT || 8080

app.use("/js", express.static(path.join(__dirname, 'dist', 'assets', 'index-TSNK7VKS.js')));
app.use(express.static(path.join(__dirname, 'dist')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use("/user", adminauth);
app.use("/user", upload.single('logo'), authenticateToken, shop);
app.use("/user/inventory", productGroup);
app.use("/user/inventory", productList);
app.use("/user/sales", authenticateToken, sales);
app.use("/user/sales", report);
app.use("/user/stock", stock);
app.use("/user/pay-method", paymentMethod);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const serverInstance = app.listen(port, ()=>{
  console.log("Listening to port: ", port);
});
export const server = () =>{
  return serverInstance;
};