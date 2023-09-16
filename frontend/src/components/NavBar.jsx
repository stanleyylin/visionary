import React from 'react'
import styled from '@emotion/styled';

const NavBar = () => {
  return (
    <NavBarContainer>
      <LogoContainer>
        Visionary
      </LogoContainer>

      <RightSideContainer>
        <p>Home</p>
        <p>Settings</p>
        <button>My Dashboard</button>
      </RightSideContainer>
    </NavBarContainer>
  )
}

const NavBarContainer = styled.div`
  position: fixed;
  width: calc(100vw - 40px);
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
`

const LogoContainer = styled.h1`
  font-family: Helvetica Now Display;
  color: black;
  font-size: 24px;
  padding: 0;
  margin-top: 10px;
  
`

const RightSideContainer = styled.div`
  font-family: Helvetica Now Display;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--gap, 3.5rem);
  > p {
    margin-top: 10px;
    font-size: 15px;
  }

  > button {

  }
`

export default NavBar
