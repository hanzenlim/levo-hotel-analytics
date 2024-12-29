export const roomMapping = {
    "4224200000000000003": {
        name: 'Deluxe Queen',
        numRooms: 25,
    },
    "4224200000000000004": {
        name: 'Premier Double',
        numRooms: 28,
    },
    "4224200000000000006": {
        name: 'Signature King',
        numRooms: 4,
    },
    "4224200000000000009": {
        name: 'Junior Suite',
        numRooms: 4,
    },
    "4224200000000000010": {
        name: 'Family Suite',
        numRooms: 7,
    },
}

export const totalRooms = 68;

const fetchOccupancy = async (fromDate, toDate) => {
    const url = 'https://analytics-levo-hotel-159222472543.us-central1.run.app/analytics';
    const payload = {
      fromDate,
      toDate,
      request: 'occupancy',
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        Promise.resolve({});
        // throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      const formattedData = {};

      let totalRoomsSold = 0
      Object.keys(roomMapping).forEach((roomId) => {
        const availRoomData = data.Success.RoomList.find((id) => id.RoomtypeID === roomId )

        if (availRoomData) {
            const numAvailRoom = availRoomData.RoomData.length;
            const roomSold = roomMapping[roomId].numRooms - numAvailRoom;
            formattedData[roomMapping[roomId].name] = roomSold
            totalRoomsSold += roomSold;
        } else {
            // If no data found it means, all rooms are sold 
            formattedData[roomMapping[roomId].name] = roomMapping[roomId].numRooms
            totalRoomsSold += roomMapping[roomId].numRooms
        }
      })

      formattedData.totalRoomsSold = totalRoomsSold
      return formattedData;
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  export default fetchOccupancy;