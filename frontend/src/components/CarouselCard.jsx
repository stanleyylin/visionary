import React from 'react'
import styled from '@emotion/styled'

const CarouselCard = ({card}) => {
  return (
    <CardContainer>

      <p>{card.content}</p>
    </CardContainer>
  )
}

const CardContainer = styled.div`
  height: 350px;
  width: 95%;
  display: flex;
  background-color: #F5F5F7;
  border-radius: 8px;
  margin-left: 20px;
`

export default CarouselCard
