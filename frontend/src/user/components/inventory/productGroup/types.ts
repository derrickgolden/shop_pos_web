import { Group } from "../../../../redux/groupList";
import { Product } from "../types";

export interface ProductGroup {
    product_totals: number;
    action: string;
    group_name: string;
    products: Product[]
  }

  export interface GroupProductDetailsProps{
    onHandleActionDetails:{}, 
    productDetails: Group,
    setShowDetails: (showlist: string) => void
}