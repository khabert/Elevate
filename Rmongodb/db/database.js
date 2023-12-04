const mongoose = require("mongoose"); 

const connectToDB = async()=> {
    try {
        const connect = await mongoose.connect("mongodb+srv://Zion:kkzMOoWcc3KEwBXl@zion.vfgrqmi.mongodb.net/?retryWrites=true&w=majority",{ 
            useNewUrlParser: true, 
            useUnifiedTopology: true,
        })
        console.log("connection to db successful")
    } catch (error) {
        console.log("connection to db failed",error)
    }
    const db = mongoose.connect
    return db
}

module.exports = connectToDB