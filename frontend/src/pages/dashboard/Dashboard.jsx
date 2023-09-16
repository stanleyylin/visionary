import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

const Dashboard = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [state, setState] = useState(0);

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
          setState(data.state);

          if (data.time_left <= 0 && data.state === 3) {
            alert("Time to take an eye break!");
          }

          console.log(state);
        } else {
          console.log("Server returned an error");
        }
      } catch (error) {
        console.log("Fetch error: ", error);
      }
    };

    fetchTimeLeft();

    const intervalId = setInterval(fetchTimeLeft, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

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

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <PageContainer className={state in [0, 1, 2] ? 'white' : state === 3 ? 'gradient' : 'paused'}
      style={{
        backgroundColor:
          state in [0, 1, 2] ? "white" : state === 3 ? "#ed809c" : "#353330",
      }}
    >
      <Container style={{ color: state in [0, 1, 2] ? "black" : "white" }}>
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
            <h3>Depth</h3>
          </DataBox>
          <DataBox>
            <h3>Orientation</h3>
          </DataBox>
        </div>
      </Container>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  width: calc(100vw - 160px);
  padding: 80px;
  transition: all 500ms;
  &.white {
    background-color: #FEFFFF;
  }
  &.gradient {
    background-image: linear-gradient(to bottom right, #FCA27C, #FF5AB4);
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

const Button = styled.button`
  border: none;
  border-radius: 6px;
  padding: 12px;
  padding-left: 22px;
  padding-right: 22px;
  cursor: pointer;
  transition: all 500ms;
  margin-top: 20px;
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
