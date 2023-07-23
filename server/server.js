import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'

import { Configuration,OpenAIApi } from 'openai'

dotenv.config()                   //this will allow us to use .env variables

const configuration=new Configuration({
    apiKey:process.env.OPENAI_API_KEY,
})

//We need to create an instance of OpenAi
const openai=new OpenAIApi(configuration)

//Once this is done, lets initialize our express
const app=express()

app.use(cors())                 //this will allow us to call the backend from the front-end
app.use(express.json())         //this will allow to pass json data from front end to backend

//Routes
app.get('/',async(req,res)=>{
    res.status(200).send({
        message:'Hello from iCoders Fam!'
    })
})

app.post('/',async(req,res)=>{
    try{
        const prompt=req.body.prompt;

        const response=await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,                         //A measure of randomness
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0.5,                 //this will ensure that our ai don't provide similar solutions to the same question
            presence_penalty: 0,
        })

        //Once the response is generated, we have to send it back to the front-end
        res.status(200).send({
            bot:response.data.choices[0].text
        })
    }
    catch(error){ 
        console.log(error);
        res.status(500).send({error})
    }
})


app.listen(5000,()=>{
    console.log('Server running on port http://localhost:5000');
})
