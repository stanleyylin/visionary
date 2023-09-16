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
        <Link className="link" to={"/"}>
          <p>Home</p>
        </Link>
        <Link className="link" to={"/settings"}>
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
  align-items: center;
  padding: 8px;
  padding-left: 40px;
  padding-right: 40px;
  background-color: rgba(252, 252, 254, 0.8);
  border-bottom: 1px solid #D6D6D6;
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  :hover {
    color: #ED809C;
  }
`;

const LogoContainer = styled.h1`
  font-family: Helvetica Now Display;
  font-size: 20px;
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
    border-radius: 6px;
    color: white;
    padding: 10px;
    margin-top: 2px;
    padding-left: 22px;
    padding-right: 22px;
    cursor: pointer;
    transition: all 500ms;
    transition: background 0.5s;
    background: linear-gradient(
        90deg,
        var(--c1, #f6d365),
        var(--c2, #fda085) 51%,
        var(--c1, #f6d365)
      )
      var(--x, 0) / 200%;
    --c2: #fca27c;
    --c1: #ff5ab4;
    :hover {
      --x: 100%;
    }
  }
`;

export default NavBar;
