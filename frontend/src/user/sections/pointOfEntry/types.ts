import { OrderDetail } from "../../pages/SalesEntry";

export interface PoeCalcHandles {
    handleDigitClick: (digit: number) => void;
    handleQuantityIncByOne: () => void;
    handleSetToQuantityChange: () => void;
    handleSetToGiveDiscount: () => void;
    handleSetToEditPrice: () => void;
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
