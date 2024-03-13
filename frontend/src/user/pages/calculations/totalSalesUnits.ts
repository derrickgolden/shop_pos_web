import { SelectedDate } from "../../components/reports/ReportHeader";

interface SalesItem {
    sub_total: number;
    units_sold: number;
    medicine_id: number;
    sales_item_id: number;
    medicine_name: string;
}

interface Sale {
    sale_id: number;
    sale_date: string;
    total_price: string;
    sales_items: SalesItem[];
    payment_methods: {}[];
}

export interface ResultItem {
    accumulatedSales:{
        day: string;
        day_sales: number;
        units_sold: number;
        Clients: number;
    }[];
    sortedSales: {}[]
}

interface calculateTotalSalesProps {
    data: Sale[], date: SelectedDate, keyType: "payment_methods" | "sales_items"
}

export function calculateTotalSales({data, date, keyType}: calculateTotalSalesProps): ResultItem {
    const accumulatedSales = [];
    const sortedSales: {}[] = [];
    const startDate = new Date(date?.startDate);
    const endDate = new Date(date?.endDate);

    // Group sales data by date
    const salesByDate: Record<string, { total_day_sales: number; units_sold: number; Clients: number }> = data.reduce((acc, sale) => {
        const saleDate = new Date(sale.sale_date);

        if (saleDate >= startDate && saleDate <= endDate) {
            const saleDate = new Date(sale.sale_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });

            if (!acc[saleDate]) {
                acc[saleDate] = { total_day_sales: 0, units_sold: 0, Clients: 0 };
            }

            // Update total_day_sales and units_sold for each sale
            sale.sales_items.forEach((item) => {
                acc[saleDate].total_day_sales += item.sub_total;
                acc[saleDate].units_sold += item.units_sold;
            });
            acc[saleDate].Clients += 1;

            sortedSales.push(sale)
        }
        return acc;
    }, {} as Record<string, { total_day_sales: number; units_sold: number; Clients: number }>); // Explicitly type the accumulator

    // Convert grouped data to the desired format
    for (const date in salesByDate) {
        accumulatedSales.push({
            day: date,
            day_sales: salesByDate[date].total_day_sales,
            units_sold: salesByDate[date].units_sold,
            Clients: salesByDate[date].Clients,
        });
    }

    return {accumulatedSales, sortedSales};
}
