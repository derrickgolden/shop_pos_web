import { SalesApiData } from "../../../redux/salesReport";
// import { salesProps } from "../../components/reports/SalesTable";

export const calcProfits = (sales: SalesApiData[]) => {
    // Get current date
    const currentDate = new Date();
    const today = currentDate.setHours(0, 0, 0, 0);
    const mondayDate = calcLastMonday(currentDate);
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        firstDayOfMonth.setHours(0, 0, 0, 0);

    let todayProfit = 0;
    let weekProfit = 0;
    let monthProfit = 0;

    const lifeTimeProfit = sales.reduce((cValue, sale) => {
        const sale_date = new Date(sale.sale_date).getTime();
        const profit = Number(sale.total_profit);

        if (today < sale_date) todayProfit += profit;
        
        if (mondayDate.getTime() < sale_date) weekProfit +=  profit;
        
        if (firstDayOfMonth.getTime() < sale_date) monthProfit +=  profit;
        
        return profit + cValue;
    }, 0)
        

    return [{lebal: "Today Profit", profit: todayProfit, bg_color: "bg-success-subtle"}, 
            {lebal: "This Week Profit", profit: weekProfit, bg_color: "bg-primary-subtle"}, 
            {lebal: "This Month Profit", profit: monthProfit, bg_color: "bg-info-subtle"}, 
            {lebal: "Life Time Profit", profit: lifeTimeProfit, bg_color: "bg-secondary-subtle"},
    ];
};

const calcLastMonday = (currentDate: Date) =>{
    // Calculate the difference between the current day of the week and Monday
    const currentDayOfWeek = currentDate.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const daysUntilMonday = (currentDayOfWeek + 6) % 7; // Calculate the number of days to subtract

    // Subtract the calculated difference from the current date to get the most recent Monday
    const mondayDate = new Date(currentDate);
    mondayDate.setDate(currentDate.getDate() - daysUntilMonday);

    // Set hours, minutes, seconds, and milliseconds to zero to represent midnight
    mondayDate.setHours(0, 0, 0, 0);

    return mondayDate;
};