import { Group } from "../../../redux/groupList";
import { ProductDetails } from "../../sections";
import { Product } from "../inventory/types";

export interface DataTableComponentProps{
    apidata: Product[] | ProductDetails[], 
    columns: ({
        name: string;
        selector: (row: Product) => number;
        sortable: boolean;
        cell?: undefined;
    } | {
        name: string;
        selector: (row: Product) => string ;
        sortable: boolean;
        cell?: undefined;
    } | {
        name: string;
        cell: (row: Product) => JSX.Element;
        selector?: undefined;
        sortable?: undefined;
    })[], search: string | number
  }
export interface DataTableProductGroupProps{
    apidata: Group[], 
    columns: ({
        name: string;
        selector: (row: Group) => number;
        sortable: boolean;
        cell?: undefined;
    } | {
        name: string;
        selector: (row: Group) => string ;
        sortable: boolean;
        cell?: undefined;
    } | {
        name: string;
        cell: (row: Group) => JSX.Element;
        selector?: undefined;
        sortable?: undefined;
    })[], 
    search: string | number
  }