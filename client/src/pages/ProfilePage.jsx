import "./ProfilePage.css";
import NavigationBar from "../components/NavigationBar";
import { getAuthData } from "../utils/authStorage";
import UserDataBox from "../components/UserDataBox";

const ProfilePage = () =>{

    const { userData , gymName} = getAuthData();
    const dataUser = JSON.parse(sessionStorage.getItem('gymnify_user_data')) || {};
    console.log(dataUser.weight)

    return(
        <div className="ProfilePage_main">
            <NavigationBar/>
            <div className="user_name_text_profile_gym_started_date_text">
                <p className="user_name_text_profile">{userData?.userName || 'User'}</p>
                <p className="gym_started_date_text">since ({userData?.registeredDate || '00/00/00'})</p>
            </div>
            {/* <div className="pricePlan_main_container">
            {userData.membershipDetail[0].planName === "Basic" ? (
               <span className="color_of_price_plan color_red" 
               ></span>
            ):(
                <span className="color_of_price_plan color_green"></span>
            )}
            <p className="price_plan_text">{userData.membershipDetail[0].planName}- Member Ship</p>
            </div> */}
            <div className="goal_and_level">
                <div className="user_goal_text">
                    <span>Your Goal</span>
                    <p>{userData?.exerciseType || '---'}</p>
                </div>
                <div className="user_exercise_level_text">
                    <span>Your Exercise Level</span>
                    <p>{userData?.activityLevel || '___'}</p>
                </div>
            </div>
            <p className="your_data_text">Your Data</p>
            <UserDataBox/>
        </div>
    );
};

export default ProfilePage;