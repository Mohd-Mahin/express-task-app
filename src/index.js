const express = require('express');
require('./db/mongoose');
const userRoute = require('./routers/user'); 
const taskRoute = require('./routers/task');
const app = express();

const PORT = process.env.PORT || 3000;

// app wide middleware
// app.use((req, res, next) => {
//     res.status(503).send('Website is in maintenance mode');
// });

app.use(express.json());
app.use('/users', userRoute);
app.use('/task', taskRoute);

app.listen(PORT, () => {
    console.log(`Listening on port - ${PORT}`);
})