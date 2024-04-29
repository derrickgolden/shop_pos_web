import { createContext, useContext } from "react";
import { CustomerContextType, SalesListContextProps } from "./types";

// Create the context
export const CustomerContext = createContext<CustomerContextType>({
    selectCustomer: undefined, setSendInvoice: () =>{}, sendInvoice: false, 
    setEntryStep: () =>({current: "inProgress", prev: ""})
  });
  
// Create a custom hook to consume the context
export const useCustomerContext = () => useContext(CustomerContext);

// Create the context
export const SalesListContext = createContext<SalesListContextProps>({
  setEntryStep: () => ({current: "inProgress", prev: ""}),
  handleNewCustomerOrder: ({date}: {date: string}) => {}, showInventoryOrders: "inventory",
  PoeCalcHandles: {}, selectCustomer: undefined,
  btnClicks: {
    isNewPayment: true, isDigit: false, focusedBtn: "qty"
  },
});
  
// Create a custom hook to consume the context
export const useSalesListContext = () => useContext(SalesListContext);