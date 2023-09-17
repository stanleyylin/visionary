import React, { useState, useEffect } from "react";

function DataDisplay() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    console.log("useEffect is running...");
    async function fetchData() {
      console.log("fetchData is called...");

      try {
        // Check if data exists
        if (data.length === 0) {
          const response = await fetch("/api/get_accounts");
          const fetchedData = await response.json();
          setData(fetchedData);
          console.log("fetched");
        }
        setLoading(false); // Data is fetched, set loading to false
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [data]);

  return (
    <div>
      <h1>Accounts</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              Account ID: {item.id}, Distance: {item.distance} m
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DataDisplay;
