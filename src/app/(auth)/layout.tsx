import React from "react";
import logo from "../../../images/logo.png";
import vidsphere from "../../../images/vidsphere.png";
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
            backgroundImage: `url("https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHRlY2hub2xvZ3l8ZW58MHx8MHx8fDA%3D")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="h-full relative flex justify-center">
            <Image
              className="absolute top-2 left-2 w-24 h-24 p-2"
              src={vidsphere}
              alt="applogo"
            />
            <p className="absolute bottom-[10%] font-medium text-xl md:text-2xl py-4 md:py-8 text-white text-center w-[75%]">
              Join us on a journey where every video tells a story and every
              moment is worth sharing.{" "}
              <span className="font-semibold text-blue-600">Sign in</span> or{" "}
              <span className="font-semibold text-blue-600">
                Create an account
              </span>{" "}
              to explore, connect, and discover your next favorite adventure.
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
