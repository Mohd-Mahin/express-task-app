const express = require("express");
const multer = require("multer");
require("./db/mongoose");
const userRoute = require("./routers/user");
const taskRoute = require("./routers/task");
const app = express();

const PORT = process.env.PORT || 3000;

// app wide middleware
// app.use((req, res, next) => {
//     res.status(503).send('Website is in maintenance mode');
// });

// multer image upload
// const upload = multer({
//   dest: "images",
// });
// app.post("/upload", upload.single("upload"), (req, res) => res.send());

app.use(express.json());
app.use("/users", userRoute);
app.use("/tasks", taskRoute);

app.listen(PORT, () => {
  console.log(`Listening on port - ${PORT}`);
});

// const auth = require("./middleware/auth");
// const Task = require("./models/task");
// const User = require("./models/user");

// const main = async function () {
//   // [1] task => populate => user  || (add author in schema and include key 'ref' -  author is a real field)
//   // const task = await Task.findById("65cbb6ad673e1c7def138d10");
//   // await task.populate("author");
//   // console.log(task.author);
//   // [2] user => populate => task || (Not stored in schema, but only a virtual document including 'ref')
//   // const user = await User.findById("65cbb650673e1c7def138d04");
//   // console.log(user);
//   // await user.populate("tasks");
//   // console.log(user.tasks);
// };

// main();

// "mongodb": "^5.1.0",
// "mongoose": "^7.0.2",
// httpstatuses.com
