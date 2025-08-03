import "./ReportPage.css";
import NavigationBar from "../components/NavigationBar";
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getAuthData } from "../utils/authStorage";
import { useState, useEffect } from 'react';
import { fetchUserData } from "../utils/apiFetcher";
import axios from 'axios';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ReportPage = () => {
  const [dataBaseData, setDataBaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const { userData, gymName } = getAuthData();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const { user } = await fetchUserData();
        setDataBaseData(user);
      } catch (err) {
        setError(err.message || "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []); 

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/reports/${userData._id}`,
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        
        if (response.data && response.data.success) {
          setReportData(response.data.data);
        } else {
          setError("No report data available");
        }
      } catch (err) {
        console.error("Error fetching report data:", err);
        setError("Failed to fetch report data");
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [userData._id]);


  function getFormattedDate() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const today = new Date();
    const dayName = days[today.getDay()];
    const monthName = months[today.getMonth()];
    const date = today.getDate().toString().padStart(2, '0');
    const year = today.getFullYear();
    
    return `${dayName} ${monthName} ${date} ${year}`;
  }

  const formattedDate = getFormattedDate();
  // console.log(reportData?.todaysData.workout.totalCalories)
  
  // Get attendance data from database or use sample data
  const attendanceData = dataBaseData?.monthlyAttendance[1].dateOfAttended|| [
    '2025-06-01',
    '2025-06-02',
    '2025-06-05',
    '2025-06-07',
    '2025-06-10',
    '2025-06-15',
    '2025-06-20',
    '2025-06-26',
  ];
  // Custom day component
  const renderDayContents = (day, date) => {
    const dateStr = date.toISOString().split('T')[0];
    const isAttended = attendanceData.includes(dateStr);
    
    return (
      <div className="custom-day-content">
        {day}
        {isAttended && <div className="day-indicator attended-indicator" />}
      </div>
    );
  };

  // Add custom class names to attended days
  const dayClassName = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return attendanceData.includes(dateStr) ? 'attended-day' : '';
  };

  // Rest of your component code remains the same...
  // Sample data for the week
  const weeklyCalorieData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Calories Burned',
        data: [400, 450, 500, 350, 600, 550, 300],
        backgroundColor: 'rgb(42, 42, 42)',
        borderColor: 'rgba(32, 32, 32, 0)',
        borderWidth: 1,
        borderRadius: 50,
      }
    ]
  };

  // Sample weight data for 12 months (replace with your actual data)
  const weightData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Weight (kg)',
        data: [78, 76.5, 75, 74, 73.5, 73, 72.5, 72, 71.5, 71, 70.5, 70],
        borderColor: '#333',
        backgroundColor: 'rgba(125, 81, 170, 0.1)',
        tension: 0.5,
        fill: true,
        pointBackgroundColor: '#333',
        pointBorderColor: '#fff',
        pointHoverRadius: 3,
        pointHoverBorderWidth: 2,
        borderWidth: 2
      }
    ]
  };

  const weightOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#333',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Weight: ${context.parsed.y} kg`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: function(value) {
            return value + ' kg';
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: false,
          text: 'Calories'
        },
        grid: {
          display: false
        }
      },
      x: {
        title: {
          display: false,
          text: 'Days'
        },
        grid: {
          display: false
        }
      }
    },
    barPercentage: 0.4,
    categoryPercentage: 0.8,
  };

  return (
    <div className="report_page">
      <NavigationBar />
      <p className="report_text_1">REPORT</p>
      <p className="todaysTotal_text">Today's Total</p>
      
      <div className="daily_report_all">
        <div className="time_calore_activity_report_daily">
          <div className="report_of_day time_spend_report">
            <p className="report_daily_data_name_text">Time</p>
            <p className="report_daily_data_real_text">
              {loading ? "Loading..." : reportData?.spentTimeOnGym?.[formattedDate] || "0 min" || "0 min"}
            </p>
          </div>
          <div className="report_of_day calorie_burned_report">
            <p className="report_daily_data_name_text">calorie🔥</p>
            <p className="report_daily_data_real_text">{loading ? "Loading..." : reportData?.todaysData.workout.totalCalories || "0"} kcal</p>
          </div>
          <div className="report_of_day activity_done_report">
            <p className="report_daily_data_name_text">Exercise</p>
            <p className="report_daily_data_real_text">{loading ? "Loading..." : reportData?.todaysData.workout.exercises.length || "0"}</p>
          </div>
        </div>
      </div>
      
      <div className="weekly_calorie_burned_box">
        <p className="weekly_calorie_burned_box_text">3,000 cal (burned in this week)</p>
        <div className="calorie_burned_weekly_chart">
          <Bar data={weeklyCalorieData} options={options} />
        </div>
      </div>
      
      <p className="your_attendance_text">Your Attendance</p>
      
      <div className="monthly_attendance_report_box">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          inline
          calendarClassName="attendance-calendar"
          renderDayContents={renderDayContents}
          dayClassName={dayClassName}
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className="calendar-header">
              <div className="calendar-month-year">
                {date.toLocaleString('default', { month: 'long' })}
                <span className="calendar-year">{date.getFullYear()}</span>
              </div>
              <div className="calendar-nav-buttons">
                <button 
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                  className="nav-button prev-button"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24">
                    <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
                  </svg>
                </button>
                <button
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                  className="nav-button next-button"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
        />
      </div>
      <p className="total_gym_seprnd_from_start_to_end">Total - {userData.totalTimeSpendOnGym} Hours</p>
      <p className="frequently_trained_bodys_text">Training Frequency</p>
      <div className="frequently_tranined_body_box"></div>
      <p className="weight_change_record_text">Your Weight Changes</p>
      <div className="weight_change_record_box">
        <div className="weight-change-chart">
          <Line data={weightData} options={weightOptions} />
        </div>
      </div>
    </div>
  );
};

export default ReportPage;