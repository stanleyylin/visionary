import React, { useState, useEffect } from "react";
import db from "../firebase";
import { doc, getDoc } from "firebase/firestore"; // Import the necessary Firebase Firestore functions

function DataDisplay() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "accounts", "r8lR54AHrJfdozDbqllp"); // Replace "your_document_id" with the actual document ID you want to retrieve
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData({
            id: docSnap.id,
            ...docSnap.data(),
          });
        } else {
          console.log("No such document!");
        }

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
        <p>
          ID: {data.id}, Distance: {data.distance} m
        </p>
      )}
    </div>
  );
}

export default DataDisplay;
