import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Foodwai API",
      version: "1.0.0",
      description: "Documentación de la API de Foodwai",
    },
    servers: [
      {
        url: "/api",
        description: "API local",
      },
    ],
  },
  apis: ["app/api/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
