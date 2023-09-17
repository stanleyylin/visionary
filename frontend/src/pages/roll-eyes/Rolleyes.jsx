import React, { useState, useEffect, useRef} from "react";
import styled from "@emotion/styled";

import { Canvas, useFrame } from '@react-three/fiber'
//import { OrbitControls } from '@react-three/drei'

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    ref.current.rotation.x += delta/2
    ref.current.rotation.y += delta
    ref.current.rotation.z += delta/3
})
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function TargetBox(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    ref.current.rotation.x += delta/2
    ref.current.rotation.y += delta
    ref.current.rotation.z += delta/3
    //console.log(distanceValue[0])
  })
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[0.7, 0.7, 0.7]} />
      <meshStandardMaterial color={'hotpink'} />
    </mesh>
  )
}

const Rolleyes = () => {

  const [score, setScore] = useState(0)
  const [distanceValue, setDistanceValue] = useState([0, 0, 0]);
  const [randomX, setRandomX] = useState(Math.random()*4 - 2)
  const [randomY, setRandomY] = useState(Math.random()*4 - 2)

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
    const fetchTimeLeft = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/time_left", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          controlTimer("pause")
          const data = await response.json();

          if (data.gazeValues && data.gazeValues.length > 2) {
            setDistanceValue([data.gazeValues[0], data.gazeValues[1], data.gazeValues[2]]);
            if(data.gazeValues[0] > randomX-0.5 && data.gazeValues[0] < randomX+0.5) {
              //console.log("xEYEYUEYUEY")
              if(data.gazeValues[1] > randomY-0.5 && data.gazeValues[1] < randomY+0.5) {
                setRandomX(Math.random()*4 - 2)
                setRandomY(Math.random()*4 - 2)
                setScore(score + 1)
              }
            }
          } else {
            console.warn(
              "eyeValues is either undefined or does not have enough elements."
            );
          }
          // if (data.time_left <= 0 && data.state === 3) {
          //   alert("Time to take an eye break!");
          //   controlTimer("pause");
          // }
          // if (data.gazeValues[2] > -3 && data.state === 3) {
          //   controlTimer("pause");
          // } else if (data.gazeValues[2] <= -3 && data.state === 4) {
          //   controlTimer("resume");
          // }

          //console.log(state)
        } else {
          console.log("Server returned an error");
        }
      } catch (error) {
        console.log("Fetch error: ", error);
      }
    };
    fetchTimeLeft();

    const intervalId = setInterval(fetchTimeLeft, 20);

    return () => {
      clearInterval(intervalId);
    };
  }, [randomX, randomY]);

  


  return (
    <div>
      Settings
      <br /><br /><br /><br />
      <Button
        style={{
          backgroundColor: "#222222",
          color: "white",
          marginLeft: "30px",
        }}
        onClick={() => controlTimer("start")}
      >
        Start
      </Button>
      <h3 style={{marginLeft: "30px"}}>X: {distanceValue[0]}</h3>
      <h3 style={{marginLeft: "30px"}}>Y: {distanceValue[1]}</h3>
      <h1 style={{display: "flex", justifyContent: "center", alignItems: "center"}}>Score: {score}</h1>

      {/* <h1>Z: {distanceValue[2]}</h1> */}
      <Canvas style={{height: "600px"}}>
        <ambientLight intensity={1} />
        <spotLight position={[2, 2, 2]} angle={0.8} penumbra={1}/>
        <pointLight position={[0, 2, 2]} intensity={1}/>
        <Box position={[distanceValue[0], distanceValue[1]*1.5, 0]} />
        <TargetBox position={[randomX, randomY, 0]}/>
      </Canvas>
    </div>
    
  )
}

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

export default Rolleyes