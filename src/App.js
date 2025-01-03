import { useEffect, useState } from 'react';
import BarChart from './BarChart';
import PieChart from './PieChart';
import fetchOccupancy, { totalRooms } from './fetchOccupancy';
import fetchArrivalList, { calculateDaysDifference } from './fetchArrivalList';
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

  // lead time reservation
  const [leadTimeReservation, setLeadTimeReservation] = useState([]);

  // Today occupancy rate
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

  // fetch lead time reservation
  useEffect(() => {
    async function fetchData() {
      const last5Days = getLastNDays(0, new Date());
      const futureDates = [0,1,2,3,4,5,6,7].map((idx) => {
        const today = new Date(); 
        const future = new Date(today); 
        future.setDate(today.getDate() + idx); 
        return future;
      })

      const result = await Promise.all(futureDates.map(async (day) => {
        const data = await fetchArrivalList(getFormattedDate(day), getFormattedDate(day));

        const initialVal = {
        };

        const formattedData = data.Reservations.Reservation.reduce((acc, currentVal) => {
          const bookingTran = currentVal.BookingTran[0];
          const createdDateTime = bookingTran.Createdatetime;
          let dayDiff = calculateDaysDifference(createdDateTime, day);
          if (dayDiff >= 7) {
            dayDiff = 7;
          }

          if (acc[dayDiff] !== undefined) {
            return {
              ...acc,
              [dayDiff]: acc[dayDiff] + 1,
            }
          }

          return {
            ...acc,
            [dayDiff]: 1,
          }

        }, initialVal)
        
        return {date: getFormattedDate(day), data: formattedData};
      }))

      setLeadTimeReservation(result);
    }

    fetchData();
  }, [])

  return (
    <div className="App">
      <img width="300" height="70" src={logo} alt="description" />;
      <div>
        <div className="container">
          <h3>Today's Occupancy Rate</h3>
          <div className="todayOccupancyRate">
            {todayOccupancyData?.totalRoomsSold && `${Math.round((todayOccupancyData.totalRoomsSold / totalRooms) * 100)}%`}
          </div>
          <h3>Room Sold / Total Rooms</h3>
          <div className="todayOccupancyNum">            
            {todayOccupancyData?.totalRoomsSold}/{totalRooms}
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
        <div className="container">
          <h3>Lead Time Reservation</h3>
          <div className="leadTimeReservation">
            <table>
              <tr>
                <th>Date</th>
                <th>0</th>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
                <th>5</th>
                <th>6</th>
                <th>7</th>
              </tr>
              {leadTimeReservation.map((res) => {
                return <>
                  <tr>
                    <td>{res.date}</td>
                    {[0,1,2,3,4,5,6,7].map((key) => {
                      if (res.data[key] === undefined) {
                        return <td>0</td>
                      }

                      return <td>{res.data[key]}</td>
                    })}
                  
                  </tr>
                </>
              })}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
