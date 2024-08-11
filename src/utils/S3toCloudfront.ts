import config from "@/conf/config";

const getImageUrl = (url: string) => {
  const baseUrl = url.split("?")[0];
  const newPath = baseUrl.split("/").slice(3).join("/");
  return `${config.AWS_CLOUDFRONT_URL}/${newPath}`;
};

export default getImageUrl;
