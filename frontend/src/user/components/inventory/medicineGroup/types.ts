export interface StockGroup {
    stock_totals: number;
    action: string;
    group_name: string;
    stocks: [{
        stock_id: number;
        stock_name: string;
        group_name: string;
        stock_qty: number;
        action: string;
    }]
  }

  export interface GroupStockDetailsProps{
    onHandleActionDetails:{}, 
    stockDetails: StockGroup,
    setShowDetails: (showlist: string) => void
}