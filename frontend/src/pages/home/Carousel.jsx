import React from 'react'
import styled from '@emotion/styled';
import Swiper from "react-slick";
import './carousel.css';
import CarouselCard from '../../components/CarouselCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    className: "hey"
  };

  const slider = React.useRef(null);

  return (
    <CarouselContainer>
      <Swiper ref={slider} {...settings}>
        {cards.map((card, index) => (
          <CarouselCard
            card={card} 
            key={index}
          />
        ))}
      </Swiper>

      <div>
        <button 
          className="carousel-control" 
          onClick={() => slider?.current?.slickPrev()}
        >
          &lt;
        </button>
        <button 
          className="carousel-control" 
          onClick={() => slider?.current?.slickNext()}
        >
          &gt;
        </button>

      </div>
      
    </CarouselContainer>
  )
}

const CarouselContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
  

`

const cards = [
  {
    content: "Is Visionary easy-to-use with Adhawk's Glasses?",
    answer: "Yup"
  },
  {
    content: "Does it provide metrics for my eye habits?",
    answer: "Of course"
  },
  {
    content: "Can it alert me to take frequent screen breaks?",
    answer: "Definitely"
  },
  {
    content: "Will it remedy myopia, eye strain, and other conditions?",
    answer: "Absolutely"
  },
  {
    content: "Is it reliable?",
    answer: "For sure"
  },
]
export default Carousel
