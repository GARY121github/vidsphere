const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";

    // Set up a URL for the video file
    const objectUrl = URL.createObjectURL(file);
    videoElement.src = objectUrl;

    videoElement.onloadedmetadata = () => {
      // Video duration in seconds, converted to milliseconds
      const durationInMilliseconds = videoElement.duration * 1000;

      // Clean up the object URL
      URL.revokeObjectURL(objectUrl);

      resolve(Math.round(durationInMilliseconds)); // Round to the nearest millisecond
    };

    videoElement.onerror = (error) => {
      reject(error);
    };
  });
};

export default getVideoDuration;
