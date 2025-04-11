const config = {
  apiUrl:
    process.env.NODE_ENV === "production"
      ? "https://foodwai.onrender.com"
      : "http://localhost:3000",
  // Otros valores de configuración según sea necesario
};

export default config;
