import React from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react';
const Header = () => {
  return (
    <HeaderContainer>
      <TextContainer>
        <h1>The <span>Solution</span> to Preventing Eye Issues</h1>
        <p>Correct harmful eye habits before its too late.</p>
        <button>Get Started</button>
      </TextContainer>
    </HeaderContainer>
  )
}

const HeaderContainer = styled.div`
  width: 100vw;
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;

`


const TextContainer = styled.div`
  width: 48vw;
  margin-left: 15vw;
  font-family: Helvetica Now Display;
  > h1 {
    line-height: 1.4;
    font-size: 54px;
    margin-bottom: 2px;
    font-weight: 700;
    > span {
      background-image: linear-gradient(to bottom right, #FCA27C, #FF5AB4);
      background-size: 100%;
      -webkit-background-clip: text;
      -moz-background-clip: text;
      -webkit-text-fill-color: transparent; 
      -moz-text-fill-color: transparent;
    }
  }
  > p {
    font-size: 22px;
    margin-bottom: 60px;
  }
  > button {
    border: none;
    background-color: #222222;
    border-radius: 6px;
    color: white;
    padding: 16px;
    font-size: 18px;
    padding-left: 47px;
    padding-right: 47px;
    cursor: pointer;
    transition: background 0.5s;
    background: linear-gradient(90deg, var(--c1, #f6d365), var(--c2, #fda085) 51%, var(--c1, #f6d365)) var(--x, 0)/ 200%;
    --c1: #FCA27C;
    --c2: #FF5AB4;
    :hover {
      --x: 100%;
    }
    
  }

`
export default Header
