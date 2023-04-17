require('dotenv').config();


const express = require('express');
const app = express();
const port = process.env.APP_PORT;
const morgan = require('morgan');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./swagger.json');

const options = {
    swaggerDefinition: swaggerConfig,
    apis: ['./routes/*.js'], // replace this with the path to your router files
};
  
const swaggerSpec = swaggerJSDoc(options);

// Define the logger function
const logger = morgan(':date[iso] :method :url :status :res[content-length] - :response-time ms');

app.use(express.json());
app.use(logger);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const treasureBoxesRouter = require('./routes/treasureBoxes');
app.use('/treasure-boxes', treasureBoxesRouter);
const dataRouter = require('./routes/data');
app.use('/data', dataRouter);

app.listen(port, () => {
  console.log(`Geolocation app listening at port ${port}`);
});
