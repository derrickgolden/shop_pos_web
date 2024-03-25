
export interface DetailCardProps{
    key: number,
    data: {
        title: string;
        side_title_link: string;
        side_title_link_caption: string;
        left_totals: number;
        left_totals_caption: string;
        right_totals: number;
        right_totals_caption: string;
        freq_bought_item?: string;
        display_date_picker: boolean;
    }
}

export interface Product {
    product_id: number;
    product_name: string;
    img_path: string | null;
    group_name: string;
    stock_qty: number;
    action: string;
    containers: number;
    warning_limit: number;
    last_stocked: Date;
    open_container_units: number;
    stock_id?: number;
    units_per_container: number;
    instructions?: string;
    side_effect?: string;
}

export interface StockDetails{
    containers: number;
    last_stocked: Date;
    product_id: number;
    product_name: string;
    open_container_units: number;
    stock_id: number;
    units_per_container: number;
    warning_limit: number;
}

export interface ProductDetailsProps{
    onHandleActionDetails:{}, 
    productDetails: Product,
    setShowDetails: (showlist: string) => void
}

export interface ProductListProps {
    onHandleActionDetails: (row: Product) => void;
    onHandleUpdateStock: (row: Product) => void;
}

export interface NewProductDetailsProps {
    group_id: number;
    product_code: string;
    product_name: string;
    group_name: string;
    instructions: string;
    side_effect: string;
    img_path: File | null;
}
