import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';

// options > swaggerjsdoc > swagger-ui-express

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'api documentation',
            version:'1.0.0',
            description: 'api documentaion',
        
        },
        servers: [
            {
                url: 'http://localhost:5001',
            }
            // production server
        ],
       components:{
        securitySchemes: {
            bearerAuth:{
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            }
        }
       }
    },
    apis: [
        './src/routes/*.js'
    ]
}
// create an object of js docs

const swaggerSpecs = swaggerJSDoc(options);

export const swaggerSetup = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))
}