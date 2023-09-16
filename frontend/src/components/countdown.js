import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

function Countdown() {
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
    <Container>
      <CountdownBox
        style={{ color: state === 1 || state === 3 ? "black" : "grey" }}
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
              <h3>Look 20ft away to continue your eye break.</h3>
            </>
          )}
          {state === 0 && (
            <Button onClick={() => controlTimer("start")}>Start</Button>
          )}
          {(state === 2 || state === 4) && (
            <Button onClick={() => controlTimer("resume")}>Resume</Button>
          )}
          {(state === 1 || state === 3) && (
            <Button onClick={() => controlTimer("pause")}>Pause</Button>
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
  );
}

const Container = styled.div`
  padding: 80px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  justify-content: center;
  gap: 20px;
  justify-content: center;
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
  background: #fdf9f9;
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
  background-color: #222222;
  border-radius: 6px;
  color: white;
  padding: 12px;
  padding-left: 22px;
  padding-right: 22px;
  cursor: pointer;
  transition: all 500ms;
  margin-top: 20px;
  :hover {
    background-color: #ed809c;
  }
`;

const DataBox = styled.div`
  padding: 40px;
  border-radius: 10px;
  border: 1px solid #f0e5e5;
  background: #fdf9f9;
  width: 100%;
`;

export default Countdown;
