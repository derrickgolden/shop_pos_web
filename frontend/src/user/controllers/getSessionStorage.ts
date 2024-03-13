export const getSessionStorage = () => {
    const userPharm: {
        user: { available: boolean; 
            user?: {
                user_id: number;
                first_name: string;
                last_name: string;
                email: string;
                remember_me: boolean;
                country: string;
                picture: string | null;
                added_by: number;
            } };
        localPharm: { available: boolean; 
            localPharm?: {
                pharmacy_id: number;
                user_id: number;
                pharmacy_name: string;
                location: string;
                pharmacy_email: string;
                pharmacy_tel: string;
                logo_path: string | null;
                extra_info: string;
                reg_date: string;
            } 
        };
    } = { user: { available: false }, localPharm: { available: false } };

    const getuser = sessionStorage.getItem("user");
    if (getuser !== null && getuser !== "undefined") {
        const user = JSON.parse(getuser);
        userPharm.user = { available: true, user };
    } else {
        userPharm.user = { available: false };
    }

    const getlocalPharm = sessionStorage.getItem("activepharmacy");
    
    if (getlocalPharm !== null && getlocalPharm !== "undefined") {
        const localPharm = JSON.parse(getlocalPharm);
        userPharm.localPharm = { 
            available: true, 
            localPharm: {...localPharm, pharmacy_id: localPharm.pharmacy_id as number } };
    } else {
        userPharm.localPharm = { available: false };
    }

    return userPharm;
};
