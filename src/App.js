import { useEffect, useState } from 'react';
import BarChart from './BarChart';
import PieChart from './PieChart';
import fetchOccupancy, { totalRooms } from './fetchOccupancy';
import logo from './assets/images/levoLogo.png';

import './App.css';

const getFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getLastNDays = (n, today = new Date()) => {
  const dates = [];

  for (let i = n; i >= 0; i--) {
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - i); // Subtract `i` days
    dates.push(getFormattedDate(pastDate));
  }

  return dates;
};

function App() {
  const [weeklyOccupancyData, setWeeklyOccupancyData] = useState([]);
  const [dateWeeklyOccupancy, setDateWeeklyOccupancy] = useState(new Date());

  const [todayOccupancyData, setTodayOccupancyData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const today = getFormattedDate(new Date());
      const data = await fetchOccupancy(today, today);

      setTodayOccupancyData(data);
    }

    fetchData();
  }, [])

  useEffect(() => {
    async function fetchData() {
      const last10Days = getLastNDays(10, dateWeeklyOccupancy);

      const result = await Promise.all(last10Days.map(async (day) => {
        const data = await fetchOccupancy(day, day);
        return {date: day, data};
      }))

      setWeeklyOccupancyData(result);
    }

    fetchData();
  }, [dateWeeklyOccupancy]);

  return (
    <div className="App">
      <img width="300" height="70" src={logo} alt="description" />;
      <div>
        <div className="container">
          <h3>Today's Occupancy Rate</h3>
          <div className="todayOccupancyRate">
            {todayOccupancyData?.totalRoomsSold && `${Math.round((todayOccupancyData.totalRoomsSold / totalRooms) * 100)}%`}
          </div>
        </div>
        <div className="container">
          <h3>Rooms Sold Today</h3>
          <div 
            style={{
              height: '500px', // Adjust the height as needed
              width: '100%',
            }} 
            className="pieChart"
          >
            <PieChart occupancyData={todayOccupancyData} />
          </div>
        </div>
        <div className="container">
          <h3>Weekly Occupancy Rate</h3>
          <div>
            <button 
              style={{
                marginRight: '12px',
              }}
              onClick={() => {
                const today = new Date(dateWeeklyOccupancy);
                const lastWeek = new Date(today);
                lastWeek.setDate(today.getDate() - 7);
                setDateWeeklyOccupancy(lastWeek);
              }}>
              Prev Week
            </button>
            <button 
            onClick={() => {
              const today = new Date(dateWeeklyOccupancy);
              const nextWeek = new Date(today);
              nextWeek.setDate(today.getDate() + 10);
              setDateWeeklyOccupancy(nextWeek);
            }}>
              Next Week
            </button>
          </div>
          <div className="barGraph">
            <div
              style={{
                height: '400px', // Adjust the height as needed
                width: '100%',
              }} 
            >
             <BarChart occupancyData={weeklyOccupancyData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
