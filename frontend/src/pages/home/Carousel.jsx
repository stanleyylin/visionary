import React from 'react'
import styled from '@emotion/styled';
import Swiper from "react-slick";
import './carousel.css';
import CarouselCard from '../../components/CarouselCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const Carousel = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
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

      <CarouselControlContainer>
        <button 
          className="carousel-control" 
          onClick={() => slider?.current?.slickPrev()}
        >
          <IoIosArrowBack/>
        </button>
        <button 
          className="carousel-control" 
          onClick={() => slider?.current?.slickNext()}
        >
          <IoIosArrowForward/>
        </button>

      </CarouselControlContainer>
      
    </CarouselContainer>
  )
}

const CarouselContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  margin-top: -40px;
`

const CarouselControlContainer = styled.div`
  align-self: center;
  display: flex;
`

const cards = [
  {
    content: <p>Is Visionary easy-to-use with <span> Adhawk's Glasses? </span></p>,
    answer: "yup"
  },
  {
    content: <p>Does it provide <span>metrics</span> for my eye habits?</p>,
    answer: "of course"
  },
  {
    content: <p>Can it alert me to take <span>frequent screen breaks</span>?</p>,
    answer: "definitely"
  },
  {
    content: <p>Could it remedy my <span>myopia, eye strain, and other conditions</span>?</p>,
    answer: "for sure"
  },
  {
    content: <p>Is it <span>reliable</span> and <span>effective</span>?</p>,
    answer: "on god"
  },
]
export default Carousel
