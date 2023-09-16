import React from 'react'
import styled from '@emotion/styled'
import Header from './Header'
import Carousel from './Carousel'

const HomePage = () => {
  return (
    <HomeContainer>
      <Header />
      <Carousel />
    </HomeContainer>
  )
}

const HomeContainer = styled.div`
  display: flex;
  color: black;
  flex-direction: column;
`

export default HomePage
