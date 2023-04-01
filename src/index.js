const express = require('express');
require('./db/mongoose');
const userRoute = require('./routers/user'); 
const taskRoute = require('./routers/task');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/users', userRoute);
app.use('/task', taskRoute);

app.listen(PORT, () => {
    console.log(`Listening on port - ${PORT}`);
})