import React, { useState, useEffect } from "react";
import db from "../firebase";

function DataDisplay() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await db.collection("accounts").get();
        const fetchedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(fetchedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  }, []);

  return (
    <div>
      <h1>Accounts</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul>
            {data.map((item) => (
              <li key={item.id}>
                Account ID: {item.id}, Distance: {item.distance} m
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default DataDisplay;
