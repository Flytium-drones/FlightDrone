import React from 'react';

const ShopByType = () => {
  const categories = [
    {
      image: '/ad.png',
      title: 'DRONES',
    },
    {
      image: '/frame.png',
      title: 'FPV DRONE FRAMES',
    },
    {
      image: '/FCpix.png',
      title: 'Flight Controllers',
    },
    {
      image: '/motor.png',
      title: 'DRONE MOTORS',
    },
    {
      image: 'R-pi.png',
      title: 'Microcontrollers',
    },
    {
      image: '/ESC.png',
      title: 'ESC',
    },
    {
      image: '/sensors.png',
      title: 'IoT Sensors',
    },
    {
      image: '/RT.png',
      title: 'Receiver & Transmitter',
    },
  ];

  return (
    <section className="py-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">OUR PRODUCT</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        {categories.map((category, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl group"
          >
            <div className="relative w-full h-64 overflow-hidden rounded-xl">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105 group-hover:rotate-[15deg] group-hover:translate-x-3 group-hover:translate-y-3 group-hover:opacity-100"
              />
            </div>

            {/* Title positioned at the bottom with adjusted color */}
            <div className="absolute bottom-4 left-0 right-0 px-6 py-3 text-center z-10">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-600">
                {category.title}
              </h3>
            </div>

            {/* Shadow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30 transition-all duration-500 group-hover:opacity-60"></div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-center transform translate-y-20 group-hover:translate-y-0 transition-all duration-500">
              <p className="text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {category.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>

  );
};

export default ShopByType;
