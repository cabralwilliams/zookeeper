
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;
const fs = require("fs");
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static('public'));

app.use("/api", apiRoutes);
app.use("/", htmlRoutes);

//const { animals } = require('./data/animals.json');
//console.log(animals);



app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});