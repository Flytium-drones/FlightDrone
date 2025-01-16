// import React, { useState, useEffect } from 'react';
import './Hero.css';

// const Hero = () => {
//   const images = [
//     { src: '/001.jpg', learnMoreUrl: '/learn-more-1', orderNowUrl: '/order-now-1' },
//     { src: '/002.jpg', learnMoreUrl: '/learn-more-2', orderNowUrl: '/order-now-2' },
//     { src: '/003.jpg', learnMoreUrl: '/learn-more-3', orderNowUrl: '/order-now-3' },
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [images.length]);

//   const prevSlide = () => {
//     const index = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
//     setCurrentIndex(index);
//   };

//   const nextSlide = () => {
//     const index = (currentIndex + 1) % images.length;
//     setCurrentIndex(index);
//   };

//   const goToSlide = (index) => {
//     setCurrentIndex(index);
//   };

//   return (
//     <section className="chk">
//       <div className="relative overflow-hidden h-full">
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
//               index === currentIndex ? 'opacity-100' : 'opacity-0'
//             }`}
//           >
//             <img src={image.src} alt={`Slide ${index}`} className="w-full h-full object-cover" />
//           </div>
//         ))}
//       </div>

     
//       <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
//         <a href={images[currentIndex].learnMoreUrl}>
//           <button className="border border-white text-white bg-transparent rounded-full px-6 py-2 hover:bg-white hover:text-black transition duration-300 ease-in-out">
//             Learn More
//           </button>
//         </a>
//         <a href={images[currentIndex].orderNowUrl}>
//           <button className="bg-black text-white rounded-full px-6 py-2 font-bold transition duration-300 ease-in-out hover:bg-gray-700">
//             Order Now
//           </button>
//         </a>
//       </div>

//       <button
//         onClick={prevSlide}
//         className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 z-20"
//       >
//         &#10094;
//       </button>
//       <button
//         onClick={nextSlide}
//         className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 z-20"
//       >
//         &#10095;
//       </button>

//       <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
//         {images.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => goToSlide(index)}
//             className={`w-3 h-3 rounded-full ${
//               currentIndex === index ? 'bg-white' : 'bg-gray-400'
//             }`}
//           />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Hero;





import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Image1 from "../../../assets/ser.png";
import Image2 from "../../../assets/sensors.png";
import Image3 from "../../../assets/001.png";
import Slider from "react-slick";

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "Upto 50% off on all Drone Components",
    description:
      "lorem His Life will forever be Changed dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    img: Image2,
    title: "30% off on all IoT Items",
    description:
      "Who's there lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 3,
    img: Image3,
    title: "70% off on all Products Sale",
    description:
      "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

const Hero = ({ handleOrderPopup }) => {
  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <div className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-gray-100 flex justify-center items-center duration-200">
      {/* background pattern */}
      <div id='custom-mobile-style' className="h-[700px] w-[700px] bg-zinc-500 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z[8] " ></div>
      {/* hero section */}
      <div className="container pb-8 sm:pb-0">
        <Slider {...settings}>
          {ImageList.map((data) => (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {/* text content section */}
                <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                  <h1
                    data-aos="zoom-out"
                    data-aos-duration="500"
                    data-aos-once="true"
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold"
                  >
                    {data.title}
                  </h1>
                  <p
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="100"
                    className="text-sm"
                  >
                    {data.description}
                  </p>
                  <div
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="300"
                  >
                    <button
                      onClick={handleOrderPopup}
                      className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-black py-2 px-4 rounded-full border border-black"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
                {/* image section */}
                <div className="order-1 sm:order-2">
                  <div
                    data-aos="zoom-in"
                    data-aos-once="true"
                    className="relative z-10"
                  >
                    <img
                      src={data.img}
                      alt=""
                      className="w-[300px] h-[300px] sm:h-[450px] sm:w-[450px] sm:scale-105 lg:scale-120 object-contain mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hero;
