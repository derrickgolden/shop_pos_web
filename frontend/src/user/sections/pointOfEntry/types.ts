import { OrderDetail } from "../../pages/SalesEntry";
import { PaymentObject } from "../../pages/types";

export interface PoeCalcHandles {
    setBtnClicks: React.Dispatch<React.SetStateAction<BtnClicksProps>>
    handleDigitClick: (digit: number) => void;
    handleQuantityIncByOne: () => void;
    handleDecreaseNcancelOrder: () => void;
    handleRefund: () => void;
    handleCustomerNote: () => void;
    handlePayment: () => void;
    handleCustomer: () => void;
  }

export interface CommonSalesEntryProps{
  activeCard: number; 
  totalPrice?: number;
  orderDetails: OrderDetail[];
  handleEditOrder: (order: OrderDetail) => void;
  windowDisplay?: string;
  setShowReview?: React.Dispatch<React.SetStateAction<boolean>>;
  handleEntryStep?: () => void
}

export interface ProductDetails {
  price: number;
  img_path: string | null;
  stock_qty: number;
  pricing_id: number;
  product_id: number;
  instructions: string;
  package_size: number;
  product_code: string;
  product_name: string;
  unit_of_measurement: string;
  open_container_units: number;
  package_cost: number;
}

export interface Order{
  date: string;
  orderDetails: OrderDetail[];
  activeOrder: boolean;
  status: string;
  totalPrice: number;
  total_profit: number;
}

export interface PaymentDetails{ 
  remaining: number; 
  change: number;
  payment_status: 'Paid'|'Pending'|'Overdue'|'Partially Paid'|'Cancelled'|'Refunded';
}

export interface BtnClicksProps{
  isNewPayment: boolean;
  isDigit: boolean;
  focusedBtn: "qty" | "disc" | "price";
}
