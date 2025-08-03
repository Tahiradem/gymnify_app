import "./NutrationPage.css";
import NavigationBar from "../components/NavigationBar";
import { FaBox, FaCartPlus, FaCheck, FaPhone, FaShoppingBasket } from "react-icons/fa";
import foodImage1 from "../assets/foodImg1.jpg";
import foodImage2 from "../assets/foodImg2.jpg";
import foodImage3 from "../assets/foodImg3.jpg";
import foodImage4 from "../assets/foodImg4.jpg";
import { useState } from "react";
import { FaChartPie } from 'react-icons/fa';


const NutrationPage = () => {
  const [activeFood, setActiveFood] = useState(null);
  const [holdTimeout, setHoldTimeout] = useState(null);

  // Sample nutrient data
  const nutrientData = [
    { name: "Protein", amount: "56g", isMacro: true },
    { name: "Calcium", amount: "1000mg", isMacro: false },
    { name: "Carbohydrates", amount: "300g", isMacro: true },
    { name: "Vitamin A", amount: "900μg", isMacro: false },
    { name: "Fats", amount: "78g", isMacro: true },
  ];

  // Food data organized by meal time
  const foodData = [
    {
      time: "Morning",
      items: [
        {
          image: foodImage1,
          name: "Cooked Rice",
          amount: "100g",
          description: "Rice is a good source of energy and contains small amounts of protein, fiber, and various vitamins and minerals. Brown rice is more nutritious than white rice."
        },
        {
          image: foodImage2,
          name: "Boiled Eggs",
          amount: "2 pieces",
          description: "Eggs are packed with high-quality protein, vitamins, and minerals. They contain all nine essential amino acids and are particularly rich in vitamin B12 and choline."
        },
        {
          image: foodImage3,
          name: "Banana",
          amount: "1 medium",
          description: "Bananas are rich in potassium, fiber, and natural sugars. They provide quick energy and help maintain proper heart function and digestion."
        }
      ]
    },
    {
      time: "Afternoon",
      items: [
        {
          image: foodImage4,
          name: "Grilled Chicken",
          amount: "150g",
          description: "Chicken is an excellent source of lean protein. It's rich in B vitamins, particularly niacin and B6, which are important for energy metabolism and brain health."
        },
        {
          image: foodImage1,
          name: "Steamed Vegetables",
          amount: "1 cup",
          description: "Steamed vegetables retain most of their nutrients. They're rich in vitamins, minerals, fiber, and antioxidants that support overall health and immune function."
        },
        {
          image: foodImage2,
          name: "Brown Rice",
          amount: "1/2 cup",
          description: "Brown rice is a whole grain that contains the bran and germ, providing more fiber, vitamins, and minerals than white rice. It's a good source of manganese and selenium."
        }
      ]
    }
  ];

  const handleMouseDown = (mealIndex, foodIndex) => {
    // Set timeout to show details after holding for 500ms
    const timeout = setTimeout(() => {
      setActiveFood({ mealIndex, foodIndex });
    }, 500);
    setHoldTimeout(timeout);
  };

  const handleMouseUp = () => {
    // Clear the timeout if user releases before hold completes
    clearTimeout(holdTimeout);
    setActiveFood(null);
  };

  const handleTouchStart = (mealIndex, foodIndex) => {
    // For touch devices
    const timeout = setTimeout(() => {
      setActiveFood({ mealIndex, foodIndex });
    }, 500);
    setHoldTimeout(timeout);
  };

  const handleTouchEnd = () => {
    clearTimeout(holdTimeout);
    setActiveFood(null);
  };

  const truncateDescription = (desc, words = 5) => {
    const wordsArray = desc.split(' ');
    if (wordsArray.length > words) {
      return wordsArray.slice(0, words).join(' ') + '...';
    }
    return desc;
  };

  return (
    <div className="nutration_page">
      <NavigationBar />
      <a className="call_for_nutration" href="tel:0978787960"><FaPhone className="call_for_nutration_icon" /></a>
      <p className="nutration_page_text_1">Nutrition Plan</p>
      
      <div className="nutrient-table-container">
        <table className="nutrient-table">
          <thead>
            <tr>
              <th>Nutrient</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {nutrientData.map((nutrient, index) => (
              <tr key={index}>
                <td>{nutrient.name}</td>
                <td>{nutrient.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="hydration_amount_text">
        <p className="hydration_amount_text_1">Hydration-</p>
        <p className="hydration_amount_text_2">1.7 Liter</p>
      </div>
      
      <p className="foods_list_text_1">Foods List For Today</p>
      
      <div className="foods_list_box_for_nutration">
        {foodData.map((meal, mealIndex) => (
          <div className="foods_in_one_period" key={mealIndex}>
            <p className="time_to_consume_food">{meal.time}</p>
            {meal.items.map((food, foodIndex) => (
              <div 
                className="each_box_for_food" 
                key={foodIndex}
                onMouseDown={() => handleMouseDown(mealIndex, foodIndex)}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={() => handleTouchStart(mealIndex, foodIndex)}
                onTouchEnd={handleTouchEnd}
              >
                <img 
                  src={food.image} 
                  className="food_image_for_butration_page" 
                  alt={food.name}
                />
                <p className="food_name_for_nutration">{food.name}</p>
                <p className="food_amount_for_nutration">{food.amount}</p>
                <p className="food_descriotion_for_nutration">
                  {truncateDescription(food.description)}
                </p>
                
                {/* Full description overlay */}
                {activeFood?.mealIndex === mealIndex && activeFood?.foodIndex === foodIndex && (
                  <div className="food_detail_overlay">
                    <div className="food_detail_content">
                      <h3>{food.name}</h3>
                      <p className="food_amount">{food.amount}</p>
                      <p className="full_description">{food.description}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="resting_timetext_conta">
        <p>Rest Time-</p>
        <p>8 Hours</p>
      </div>
      {/* <p className="suplment_paln_text_1">Supplment Plan</p> */}
      <div className="suplment_box_for_nutration">
        <p className="suplmment_period_name">Pre-workout Supplment</p>
        <ul>
          <li>protien - 100g</li>
          <li>Cretean - 100g</li>
        </ul>
      </div>
      <p className="package_proividing_desc">If you want to get a full package (including suplemts) click the button below for the next day. Full Delivery!</p>
      <a className="order_full_pack_btn">order full package <FaShoppingBasket className="icon" /></a>
    </div>
  );
};

export default NutrationPage;