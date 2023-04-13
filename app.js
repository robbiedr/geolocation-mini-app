require('dotenv').config();


const express = require('express');
const app = express();
const port = process.env.APP_PORT;
const morgan = require('morgan');

// Define the logger function
const logger = morgan(':date[iso] :method :url :status :res[content-length] - :response-time ms');

app.use(express.json());
app.use(logger);

const treasureBoxesRouter = require('./routes/treasureBoxes');
app.use('/treasure-boxes', treasureBoxesRouter);

app.listen(port, () => {
  console.log(`Geolocation app listening at port ${port}`);
});
