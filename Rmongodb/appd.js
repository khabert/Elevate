const express = require("express")
const connectToDB = require("./db/database")
const productModel = require("./models/productModel")

const app = express()
app.use(express.json())

connectToDB()

app.get('/',(request,response)=>{
    return response.send('hey Khabert')
})
app.get('/get',async (request,response)=>{
    try {
        const profile = await productModel.find()
        return response.status(200).json(profile)
    } catch (error) {
        return response.status(500).json(error)
    }
})
app.post('/create',async (request,response)=>{
    console.log(request.body)
    try {
        const newProfile = await productModel.create(request.body)
        console.log(newProfile)
        return response.status(200).json(newProfile)
    } catch (error) {
        console.log(error)
        return response.status(500).json(error)
    }
})
app.put('/update', async (request,response)=>{
    try {
        let doc = await productModel.findOneAndUpdate({_id:"653b7d4374d93d5ebbc6cfa4"},request.body,{
            new: true
        })
        console.log(doc)
        return response.status(200).json(doc)
    } catch (error) {
        console.log(error)
        return response.status(500).json(error)
    }
})
app.delete('/delete/:id', async (request,response)=>{
    try {
        let remove = await productModel.deleteOne({_id: request.params.id})
        console.log(remove)
        return response.status(200).json(remove)
    } catch (error) {
        console.log(error)
        return response.status(500).json(error)
    }
})
app


const port = process.env.PORT || 3000

app.listen(port, ()=>{
    console.log(`app running at http://localhost:${port}`)
})