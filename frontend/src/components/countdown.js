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
      <CountdownBox>
        <h1>
          {minutes}:{seconds}
        </h1>
        {state === 0 && (
          <Button onClick={() => controlTimer("start")}>Start</Button>
        )}
        {(state === 2 || state === 4) && (
          <>
            <h3>left in your focus state</h3>
            <Button onClick={() => controlTimer("resume")}>Resume</Button>
          </>
        )}
        {(state === 1 || state === 3) && (
          <>
            <h3>PAUSED</h3>
            <Button onClick={() => controlTimer("pause")}>Pause</Button>
          </>
        )}
      </CountdownBox>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  padding: 80px 0;
  display: flex;
  justify-content: center;
`;

const CountdownBox = styled.div`
  width: 40vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  gap: 20px;
  border-radius: 10px;
  border: 1px solid #b7b4b0;
  background: #fcf9f7;

  > h1 {
    font-size: 64px;
    line-height: 64px;
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
  :hover {
    background-color: #dd8134;
  }
`;

export default Countdown;
