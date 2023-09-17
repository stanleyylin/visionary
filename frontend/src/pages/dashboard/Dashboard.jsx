import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import LineChart from "../../components/LineChart";
import DataDisplay from "../../components/DataDisplay";
import {
  doc,
  collection,
  setDoc,
  addDoc,
  Timestamp,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import db from "../../firebase";

const Dashboard = () => {
  const [distanceValue, setDistanceValue] = useState(0);
  const [pupilValue, setPupilValue] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [state, setState] = useState(0);
  const [dataEntries, setDataEntries] = useState([]); // Store data entries

  const [connectString, setConnectString] = useState("Connect to AdHawk");

  const [distanceData, setDistanceData] = useState([]); // Store sample data for distance values
  const [pupilData, setPupilData] = useState([]); // Store sample data for pupil values

  useEffect(() => {
    // Function to fetch the most recent 24 entries from the "accounts" collection
    const fetchRecentEntries = async () => {
      try {
        const entriesRef = collection(db, "accounts");
        const entriesQuery = query(
          entriesRef,
          orderBy("timestamp", "desc"),
          limit(48)
        );
        const querySnapshot = await getDocs(entriesQuery);

        const recentData = querySnapshot.docs
          .map((doc) => doc.data())
          .reverse(); // Reverse the order to show the most recent first

        // Extract distance and pupil values into separate arrays
        const distanceValues = recentData.map((data) => data.distanceValue);
        const pupilValues = recentData.map((data) => data.pupilValue);

        // Calculate absolute values and set the sampleData states
        const absoluteDistanceValues = distanceValues.map((value) =>
          Math.abs(value)
        );
        const absolutePupilValues = pupilValues.map((value) => Math.abs(value));

        setDistanceData(absoluteDistanceValues);
        setPupilData(absolutePupilValues);
      } catch (error) {
        console.error("Error fetching recent data:", error);
      }
    };

    // Fetch recent data when the component mounts
    fetchRecentEntries();
  }, []);

  useEffect(() => {
    const fetchTimeLeft = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/time_left", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTimeLeft(Math.floor(data.time_left));

          if (data.gazeValues && data.gazeValues.length > 2) {
            setDistanceValue(data.gazeValues[2]);
          } else {
            console.warn(
              "gazeValues is either undefined or does not have enough elements."
            );
          }

          setPupilValue(data.pupilValue);
          setState(data.state);

          if (data.time_left <= 0 && data.state === 3) {
            alert("Time to take an eye break!");
            controlTimer("pause");
          }
          if (data.gazeValues && data.gazeValues[2] > -3 && data.state === 3) {
            controlTimer("pause");
          } else if (
            data.gazeValues &&
            data.gazeValues[2] <= -3 &&
            data.state === 4
          ) {
            controlTimer("resume");
          }

          //console.log(state)
        } else {
          console.log("Server returned an error");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchTimeLeft();

    const intervalId = setInterval(fetchTimeLeft, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const connectToGlasses = async () => {
    if (connectString === "Connecting..." || connectString === "Disconnect") {
      setConnectString("Connect to AdHawk");
      await fetch("http://127.0.0.1:5000/disconnect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      setConnectString("Connecting...");
      await fetch("http://127.0.0.1:5000/connectToGlasses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      await fetch("http://127.0.0.1:5000/connectToGlasses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      //console.log(response)
      setConnectString("Disconnect");
    }
  };

  const controlTimer = async (action) => {
    await fetch("http://127.0.0.1:5000/control", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action }),
    });
  };

  useEffect(() => {
    const resetTimer = async () => {
      await fetch("http://127.0.0.1:5000/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    };

    resetTimer();
  }, []);

  const addDataEntry = () => {
    const timestamp = Timestamp.now(); // Use Timestamp.now() to get the current timestamp
    const newDataEntry = {
      timestamp: timestamp,
      distanceValue: distanceValue,
      pupilValue: pupilValue,
    };

    // Specify the Firestore collection reference
    const dataCollectionRef = collection(db, "accounts"); // Reference the "accounts" collection

    // Use addDoc to add a new document to the collection
    addDoc(dataCollectionRef, newDataEntry)
      .then((docRef) => {
        console.log("Data entry added with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding data entry: ", error);
      });

    setDataEntries((prevEntries) => [...prevEntries, newDataEntry]);
  };

  useEffect(() => {
    // Check if state is not equal to 0, and add data entries every 5 seconds
    if (state !== 0) {
      const intervalId = setInterval(addDataEntry, 5000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [state, distanceValue, pupilValue]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <PageContainer
      className={
        state in [0, 1, 2] ? "white" : state === 3 ? "gradient" : "paused"
      }
      style={{
        backgroundColor:
          state in [0, 1, 2] ? "white" : state === 3 ? "#ed809c" : "#353330",
      }}
    >
      <Container style={{ color: state in [0, 1, 2] ? "black" : "white" }}>
        <ConnectBox>
          <h4>
            {connectString === "Disconnect"
              ? "Your glasses are connected"
              : "Connect your glasses to start"}
          </h4>
          <Button
            style={{
              backgroundColor: state in [0, 1, 2] ? "#222222" : "white",
              color: state in [0, 1, 2] ? "white" : "black",
            }}
            onClick={() => connectToGlasses()}
          >
            {connectString}
          </Button>
        </ConnectBox>
        <CountdownBox
          style={{
            color:
              state === 1
                ? "black"
                : state === 3
                ? "white"
                : state === 4
                ? "lightgrey"
                : "grey",
          }}
        >
          <h1>
            {minutes}:{seconds}
          </h1>
          <div>
            {(state === 1 || state === 2) && <h3>left in your focus state.</h3>}
            {state === 3 && <h3>left in your eye break.</h3>}
            {state === 4 && (
              <>
                <h2>EYE BREAK PAUSED</h2>
                <h3>Look 20 ft away to resume your break.</h3>
              </>
            )}
            {state === 0 && (
              <Button
                style={{
                  backgroundColor: state in [0, 1, 2] ? "#222222" : "white",
                  color: state in [0, 1, 2] ? "white" : "black",
                }}
                onClick={() => controlTimer("start")}
              >
                Start
              </Button>
            )}
            {(state === 2 || state === 4) && (
              <Button
                style={{
                  backgroundColor: state in [0, 1, 2] ? "#222222" : "white",
                  color: state in [0, 1, 2] ? "white" : "black",
                }}
                onClick={() => controlTimer("resume")}
              >
                Resume
              </Button>
            )}
            {(state === 1 || state === 3) && (
              <Button
                style={{
                  backgroundColor: state in [0, 1, 2] ? "#222222" : "white",
                  color: state in [0, 1, 2] ? "white" : "black",
                }}
                onClick={() => controlTimer("pause")}
              >
                Pause
              </Button>
            )}
          </div>
        </CountdownBox>
        <div
          style={{
            display: "flex",
            gap: "20px",
            width: "40vw",
          }}
        >
          <DataBox>
            <h3>Distance</h3>
            <p>{Number(distanceValue).toFixed(5)}</p>
          </DataBox>
          <DataBox>
            <h3>Average Pupil Width</h3>
            <p>{Number(pupilValue).toFixed(5)}</p>
          </DataBox>
        </div>
        <div
          style={{
            display: "flex",
            gap: "20px",
            width: "40vw",
          }}
        >
          <DataBox>
            <LineChart title={"Distance Graph"} data={distanceData} />
          </DataBox>
        </div>
        <div
          style={{
            display: "flex",
            gap: "20px",
            width: "40vw",
          }}
        >
          <DataBox>
            <LineChart title={"Pupil Graph"} data={pupilData} />
          </DataBox>
        </div>
        {/* <DataDisplay /> */}
      </Container>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  width: calc(100vw - 160px);
  padding: 80px;
  transition: all 500ms;
  &.white {
    background-color: #feffff;
  }
  &.gradient {
    background-image: linear-gradient(to bottom right, #fca27c, #ff5ab4);
  }
  &.paused {
    background-color: #464646;
  }
`;

const Container = styled.div`
  padding: 80px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  justify-content: center;
  gap: 20px;
  justify-content: center;
  transition: all 500ms;
`;

const CountdownBox = styled.div`
  width: 40vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  justify-content: center;
  padding: 40px 0;
  border-radius: 10px;
  border: 1px solid #f0e5e5;
  background: #f0e5e510;
  line-height: 16px;

  > h1 {
    font-size: 64px;
    line-height: 64px;
  }

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const ConnectBox = styled.div`
  width: calc(40vw - 40px);
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid #f0e5e5;
  background: #f0e5e510;
  line-height: 16px;
`;

const Button = styled.button`
  border: none;
  border-radius: 6px;
  padding: 12px;
  padding-left: 22px;
  padding-right: 22px;
  cursor: pointer;
  transition: all 500ms;
  :hover {
    opacity: 0.5;
  }
`;

const DataBox = styled.div`
  padding: 40px;
  border-radius: 10px;
  border: 1px solid #f0e5e5;
  background: #f0e5e510;
  width: 100%;
`;

export default Dashboard;
