import React, { useState, useEffect } from "react";
import db from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore"; // Import the necessary Firebase Firestore functions

function DataDisplay() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = collection(db, "accounts"); // Reference the "accounts" collection
        const q = query(docRef, orderBy("timestamp", "desc")); // Order by timestamp in descending order
        const querySnapshot = await getDocs(q);

        const fetchedData = [];
        querySnapshot.forEach((doc) => {
          fetchedData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setData(fetchedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Distances & Pupil</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {data.map((item) => (
            <p key={item.id}>
              ID: {item.id}, Distance: {item.distanceValue} m , Pupil:
              {item.pupilValue} cm
            </p>
          ))}
        </>
      )}
    </div>
  );
}

export default DataDisplay;
