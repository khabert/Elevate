const mongoose = require('mongoose')

const productschema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Contact: {
        type: Number,
        required: true
    }
})
const productModel = mongoose.model('profile',productschema)
module.exports = productModel