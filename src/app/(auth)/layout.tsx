import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="w-full flex flex-col md:flex-row relative items-center z-50">
      <div className="w-full md:w-3/6">
        <div
          className="h-[60vh] md:h-screen bg-cover flex flex-col items-center justify-center"
          style={{
            backgroundImage: `url(${"/images/auth.jpg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <p className="text-xl md-text-3xl font-semibold text-center text-orange-700">
            &nbsp; &nbsp; &nbsp; &nbsp; Welcome to VidSphere{" "}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-gray-900 md:h-screen w-full md:w-3/6">
        {children}
      </div>
    </div>
  );
};

export default layout;
