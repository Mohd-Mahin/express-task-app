const mongoose = require('mongoose');

const connectionUrl = 'mongodb://root:root@127.0.0.1:27017/';

async function databaseInit() {
    const mongoDb = await mongoose.connect(connectionUrl, {
        dbName: 'task-manager-api'
    });    
    return mongoDb;
}

databaseInit().then((res) => {
    console.log('database initialized...'); 
});