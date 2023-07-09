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
});

// const auth = require('./middleware/auth');
// const Task = require('./models/task');
// const User = require('./models/user');

// const main = async function () {
//     // task => populate => user
//     // const task = await Task.findById('649892135b77161b980f7264');
//     // await task.populate('author');
//     // console.log(task.author);

//     // const user = await User.findById('64a8305d18b0c099066de583');
//     // console.log(user);
//     // await user.populate('tasks');
//     // console.log(user.tasks);
// }

// main();



// "mongodb": "^5.1.0",
// "mongoose": "^7.0.2",