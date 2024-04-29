import InventorySelect from "./pointOfEntry/InventorySelect";
import OrderDisplay from "./pointOfEntry/OrderDisplay";
import POEcalc from "./pointOfEntry/POEcalc";
import ValidateOrders from "./pointOfEntry/ValidateOrders";
import PrintReceipt from "./pointOfEntry/PrintReceipt";
import OrdersList from "./pointOfEntry/OrdersList";
import CustomerList from "./CustomerList";
import SelectOrders from "./pointOfEntry/SelectOrders";
import SalesList from "./pointOfEntry/SalesList";
import { ProductDetails, Order, BtnClicksProps, PaymentDetails } from "./pointOfEntry/types";


export {
    InventorySelect, OrderDisplay, POEcalc, ValidateOrders, PrintReceipt, OrdersList,
    CustomerList, SelectOrders, SalesList
}

export type {
    ProductDetails, Order, BtnClicksProps, PaymentDetails
}