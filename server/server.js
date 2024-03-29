import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'

import { Configuration,OpenAIApi } from 'openai'

dotenv.config()   

const configuration=new Configuration({
    apiKey:"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",
})
const openai=new OpenAIApi(configuration)

const app=express()

app.use(cors())                 
app.use(express.json())    

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
            temperature: 0,                         
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0.5,                 //this will ensure that our ai don't provide similar solutions to the same question
            presence_penalty: 0,
        })

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
