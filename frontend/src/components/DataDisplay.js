import React, { useState, useEffect } from "react";
import db from "../firebase";
import { collection, getDocs } from "firebase/firestore"; // Import the necessary Firebase Firestore functions

function DataDisplay() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = collection(db, "accounts"); // Reference the "accounts" collection
        const querySnapshot = await getDocs(docRef);

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
      <h1>Accounts</h1>
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
