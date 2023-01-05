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
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://capstone--client.herokuapp.com');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Custom-Header, Accept, Authorization');
    res.header('Access-Control-Expose-Headers', 'Cache-Control, Content-Language, Content-Length, Content-Type, Expires, Last-Modified, Pragma');
    res.header('Access-Control-Max-Age: 600');
    next();
}
app.use(cors());
app.options('*', cors())
app.use(allowCrossDomain);

//cache-control header
let setCache = function (req, res, next) {
    const period = 60 * 5
    if (req.method == 'GET') {
        res.set('Cache-control', `public, max-age=${300}`)
    } else {
        res.set('Cache-control', `no-store`)
    }
    next()
}
app.use(setCache)

app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));
app.use(bodyParser.json({ limit: '20mb' }));

//these lines removed the syntax error for the manifest.json images
app.use(express.static(path.join(__dirname, 'client', 'build')))
app.get("/*", (req, res) => { res.sendFile(path.join(__dirname, '/client/public/index.html')); })

app.use('/api/users/', userRoutes);
app.use('/api/quizzes/', quizRoutes);

// const corsOptions = {
//     origin: '*',
//     callback(null, true);
// },
// methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
// allowedHeaders: ["Access-Control-Allow-Origin", "Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
// credentials: true
// };


// const corsOptions = {
//     origin: 'https://capstone--client.herokuapp.com/*',
//     preflightContinue: false,
// }

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => console.log('Database connection established'))
    .catch(er => console.log('Error connecting to mongodb instance: ', er));

server = app.listen(PORT, () => {
    console.log(`Node server running on port: ${PORT}`);
});
