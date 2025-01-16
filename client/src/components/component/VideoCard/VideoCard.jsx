import React from 'react';

const VideoCard = () => {
    return (
        <div className="bg-gray-100 flex justify-center items-center  p-4">
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-6xl">
                {/* Video Section */}
                <div className="w-full md:w-2/3">
                    <video className="w-full h-48 md:h-full object-cover" autoPlay loop muted>
                        <source src="./13370-247710847_medium.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Content Section */}
               
            </div>
        </div>
    );
};

export default VideoCard;
