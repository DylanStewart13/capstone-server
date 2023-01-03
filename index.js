const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const userRoutes = require('./routes/users');
const quizRoutes = require('./routes/quizzes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
let server;

// middlware configuration

// CORS middleware
// var allowCrossDomain = function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Origin,  X-PINGOTHER, Content-Type, Accept, Authorization');
//     next();
// }
// app.use(cors());
// app.options('*', cors())
// app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));
app.use(bodyParser.json({ limit: '20mb' }));

app.use('/api/users/', userRoutes);
app.use('/api/quizzes/', quizRoutes);

const corsOptions = {
    origin: 'https://bottega-capstone-client.netlify.app',
    // methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    // allowedHeaders: ["Access-Control-Allow-Origin", "Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    // credentials: true
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));


mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => console.log('Database connection established'))
    .catch(er => console.log('Error connecting to mongodb instance: ', er));

server = app.listen(PORT, () => {
    console.log(`Node server running on port: ${PORT}`);
});
