
export interface RegisterSalesProp{
    orderDetails: [];
    totalPrice: number;
    total_profit: number;
    moneyTrans: {
        customerGave: number, 
        change: {};
    };
    updateStock: {product_id: number, remainingContainers: number, remainingUnits: number}[];
    shop_id: number;
}

export interface RegisterShopProps{
    shopDetails:{
        shop_name: string;
        location: string;
        shop_email: string;
        shop_tel: string;
        extra_info: string;
    }
    user: {
        user_id: number
    }
    logo: {
        path: string
    }
}