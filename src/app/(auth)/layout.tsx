import React from "react";
import logo from "../../../images/logo.png";
import background_image from "../../../images/auth.jpeg";
import Image from "next/image";

interface LayoutProps {
  children: React.ReactNode;
}

const layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row relative items-center z-50">
      <div className="w-full md:w-3/6">
        <div
          className="h-[60vh] md:h-screen bg-cover"
          style={{
            backgroundImage: `url(${background_image.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex flex-col items-center justify-center h-full bg-gray-900 bg-opacity-40 p-4">
            <div className="flex items-center mb-4">
              <Image className="w-12 h-12" src={logo} alt="applogo" />
              <p className="font-semibold text-base ml-2 text-white">
                VidSphere
              </p>
            </div>
            <p className="font-medium text-2xl md:text-3xl py-4 md:py-8 text-white text-center">
              Share,{" "}
              <span className="font-normal">
                your moments with the world around you on VidSphere.
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-gray-900 md:h-screen w-full md:w-3/6">
        {children}
      </div>
    </div>
  );
};

export default layout;
