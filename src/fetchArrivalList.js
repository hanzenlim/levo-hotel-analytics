export const calculateDaysDifference = (createdDate, effectiveDate) => {
    const created = new Date(createdDate);
    const effective = new Date(effectiveDate);

    // Extract year, month, and date to ignore hours and time
    const createdDateOnly = new Date(created.getFullYear(), created.getMonth(), created.getDate());
    const effectiveDateOnly = new Date(effective.getFullYear(), effective.getMonth(), effective.getDate());

    const differenceInMs = effectiveDateOnly - createdDateOnly;
    return Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
};

const fetchArrivalList = async (fromDate, toDate) => {
    const url = 'https://analytics-levo-hotel-159222472543.us-central1.run.app/arrivalList';
    const payload = {
      fromDate,
      toDate,
      request: 'arrival',
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
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  export default fetchArrivalList;