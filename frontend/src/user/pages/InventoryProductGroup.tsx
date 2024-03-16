
import { useState } from "react";
import PagesHeader from "../components/sharedComponents/PagesHeader";
import GroupList from "../components/inventory/productGroup/GroupList";
import GroupProductDetails from "../components/inventory/productGroup/GroupProductDetails";
import AddGroupForm from "../components/inventory/productGroup/AddGroupForm";
import { Group } from "../../redux/groupList";

const InventoryProductGroup = () =>{
    const [showDetails, setShowDetails] = useState("list");
    const [productDetails, setProductDetails] = useState<Group>();

    const handleActionDetails = (row: Group) =>{
        setProductDetails(row);
        setShowDetails("details");
    }
  
    return(
        <div className='body2 bg-white pb-5' style={{paddingTop: "2rem"}}>
            <PagesHeader 
                setShowDetails ={setShowDetails}
                btnInfo = {{text: "Add New Group", navigate: "addgroup", details: "group"}}
            />
            {showDetails === "list" && 
                <GroupList 
                    onHandleActionDetails = {handleActionDetails}
                />
            }
            {showDetails === "details" && productDetails &&
                <GroupProductDetails 
                    productDetails = {productDetails}
                    onHandleActionDetails = {handleActionDetails}
                    setShowDetails={setShowDetails}
                />
            }
            {showDetails === "addgroup" && 
                <AddGroupForm 
                    setShowDetails ={setShowDetails}
                />
            }
        </div>
    )
}

export default InventoryProductGroup;