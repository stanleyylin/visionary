import React from "react";
import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const nav = useNavigate();

  return (
    <NavBarContainer>
      <LogoLink to="/">
        <LogoContainer>Visionary</LogoContainer>
      </LogoLink>

      <RightSideContainer>
        <Link className="link">
          <p>Home</p>
        </Link>
        <Link className="link">
          <p>Settings</p>
        </Link>
        <button onClick={() => nav("/dashboard")}>My Dashboard</button>
      </RightSideContainer>
    </NavBarContainer>
  );
};

const NavBarContainer = styled.div`
  position: fixed;
  width: calc(100vw - 80px);
  display: flex;
  justify-content: space-between;
  padding-left: 40px;
  padding-right: 40px;
`;

const LogoLink = styled(Link)`
  text-decoration: none,
  :hover {
    color: #ED809C;
  }
`;

const LogoContainer = styled.h1`
  font-family: Helvetica Now Display;
  color: black;
  font-size: 24px;
  padding: 0;
  margin-top: 16px;
`;

const RightSideContainer = styled.div`
  font-family: Helvetica Now Display;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--gap, 3.5rem);
  .link {
    text-decoration: none;
    color: black;
    > p {
      margin-top: 16px;
      font-size: 15px;
      cursor: pointer;
      transition: color 300ms;
      :hover {
        color: rgb(100, 100, 100);
      }
    }
  }

  > button {
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
      background-color: #ed809c;
    }
  }
`;

export default NavBar;
