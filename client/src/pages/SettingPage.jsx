import "./SettingPage.css";
import NavigationBar from "../components/NavigationBar";
import { fetchUserData } from "../utils/apiFetcher";
import { useState, useEffect } from "react";
import { getAuthData } from '../utils/authStorage';


const SettingPage = () => {
    const { userData } = getAuthData();

const today = new Date();
const dayNumber = today.getDay(); 
        console.log(userData.exercises[dayNumber - 1])
    return (
        <div className="setting_page_main_conta">
            <NavigationBar/>
            <p className="setting_text_1">
                Settings
            
            </p>
            <p className="nottxt">No Data Appear Here !!!</p>
        </div>
    );
};

export default SettingPage;