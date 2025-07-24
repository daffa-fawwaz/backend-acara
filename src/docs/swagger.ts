import { version } from "mongoose";
import swaggerAutogen from "swagger-autogen";


const outputFile = "./src/docs/swagger.json";
const endpointsFiles = ["./src/routes/api.ts"];
const doc = {
    info: {
        version: "0.0.1",
        title: "Acara API",
        description: "Acara API documentation"
    },
    servers: [
    {
        url: "http://localhost:3000/api",
        description: "Local server development"
    },
    {
        url: "https://backend-acara-ivory.vercel.app/api",
        description: "Deploy server development"
    }
    ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                },
            },
            schemas: {
                loginRequest: {
                    identifier: "daffafawwaz",
                    password: "12345"
                }
            }
        }

    
}


swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);