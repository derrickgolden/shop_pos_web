
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

export interface Stock {
    item_id: number;
    stock_name: string;
    img_path: string | null;
    group_name: string;
    stock_qty: number;
    action: string;
    containers: number;
    warning_limit: number;
    last_stocked?: Date;
    open_container_units?: number;
    stock_id?: number;
    units_per_container: number;
  }

export interface StockDetails{
    containers: number;
    last_stocked: Date;
    item_id: number;
    stock_name: string;
    open_container_units: number;
    stock_id: number;
    units_per_container: number;
    warning_limit: number;
}

export interface StockDetailsProps{
    onHandleActionDetails:{}, 
    stockDetails: Stock,
    setShowDetails: (showlist: string) => void
}

export interface StockListProps {
    onHandleActionDetails: (row: Stock) => void;
    onHandleUpdateStock: (row: Stock) => void;
  }

  export interface Stock {data:{
    stock_id: number;
    stock_code: string;
    stock_name: string;
    stock_qty: number;
    instructions: string;
    side_effect: string;
    group_id: number;
    group_name: string;
    description: string;
}}
