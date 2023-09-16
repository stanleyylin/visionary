import React from "react";
import Countdown from "../../components/countdown";
import styled from "@emotion/styled";

const Dashboard = () => {
  return (
    <PageContainer>
      <div>
        <Countdown />
      </div>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  width: 100%;
  padding: 40px;
`;

export default Dashboard;
