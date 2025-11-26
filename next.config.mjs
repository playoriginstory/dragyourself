/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['res.cloudinary.com', 'cdn.pixabay.com'], // add any sources you use
    },
  };
  
  export default nextConfig;
  