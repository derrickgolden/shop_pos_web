interface user {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    remember_me: boolean;
    country: string;
    picture: string | null;
    added_by: number;
}
interface localShop{
    shop_id: number;
    user_id: number;
    shop_name: string;
    location: string;
    shop_email: string;
    shop_tel: string;
    logo_path: string | null;
    extra_info: string;
    reg_date: string;
}

export const getSessionStorage = () => {
    const userShop: {user: user | undefined, localShop: localShop | undefined} = {user: undefined, localShop: undefined};

    const getuser = sessionStorage.getItem("user");
    if (getuser !== null && getuser !== "undefined") {
        const user = JSON.parse(getuser);
        userShop.user = user ;
    } 
    const getlocalShop = sessionStorage.getItem("activeshop");
    
    if (getlocalShop !== null && getlocalShop !== "undefined") {
        const localPharm = JSON.parse(getlocalShop);
        userShop.localShop = localPharm;
    }
    return userShop;
};
