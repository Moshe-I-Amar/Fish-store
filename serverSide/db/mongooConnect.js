const mongoose = require('mongoose');
const {config} = require('../config/secrets');


main().catch(err => console.log(err));

async function main() {
    mongoose.set('strictQuery', false)
    await mongoose.connect(config.db_url);
    console.log('Mongoose Connect FishStore');
}