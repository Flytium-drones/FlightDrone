import React, { useState } from 'react';
import './GalleryCard.css';

const GalleryCard = () => {
  const images = [
    {
      src: '/001.jpg',
      title: 'Drone Experience Arena',
      buttonText: 'Book Drone Arena',
      buttonAction: () => window.location.href = '/drone-arena',
    },
    {
      src: '/001.jpg',
      title: 'FPV Racing Event',
      buttonText: 'Register for Event',
      buttonAction: () => window.location.href = '/event-registration',
    },
    {
      src: '/003.jpg',
      title: 'About Us',
      buttonText: 'Learn More About Us',
      buttonAction: () => window.location.href = '/about-us',
    },
    {
      src: '/002.jpg',
      title: 'Drone Community',
      buttonText: 'Join the Drone Community',
      buttonAction: () => window.location.href = '/community',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="carousel-container">
      {/* Left Side: Photo Stack */}
      <div className="image-stack">
        {images.map((img, index) => (
          <div
            key={index}
            className={`image-slide ${index === currentIndex ? 'active' : 'inactive'}`}
            style={{ zIndex: images.length - index }} // Ensure proper stacking order
          >
            <img src={img.src} alt={img.title} />
          </div>
        ))}
      </div>

      {/* Right Side: Content and Controls */}
      <div className="carousel-controls">
        <h1 className='head'>{images[currentIndex].title}</h1>
        <button className="book-btn" onClick={images[currentIndex].buttonAction}>
          {images[currentIndex].buttonText}
        </button>
        <div className="arrow-controls">
          <button onClick={prevImage} className="arrow-btn left">&#8592;</button>
          <button onClick={nextImage} className="arrow-btn right">&#8594;</button>
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;
