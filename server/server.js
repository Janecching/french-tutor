import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateChatResponse(conversation) {
    try {

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a french waiter. Use basic french to serve user, provide english translation and correct user's grammar." },
                { role: "user", content: conversation },
            ], //You are a french tutor. Teach user basic phrases and correct user's grammar
        });
        // const response = await openai.createCompletion({
        //     model: 'text-davinci-003',
        //     prompt: "The following is a conversation with an french tutor. The tutor speaks in very basic french and provides translation of their response in english, and corrects the student's responses. \n\nHuman: Hello, who are you?",
        //     temperature: 0,
        //     max_tokens: 150,
        //     top_p: 1,
        //     frequency_penalty: 0,
        //     presence_penalty: 0.6,
        //     stop: [' Human:', ' AI:'],
        // });
        console.log(response.data.choices)
        const reply = response.data.choices[0].message.content.trim();
        return reply;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


app.get('/', async(req, res) => {
    res.status(200).send({
        message: 'Hello from your french tutor!'
    })
})

app.post('/', async(req, res) => {
    try {
        const conversationPrompt = req.body.conversation;
        console.log(conversationPrompt)





        const reply = await generateChatResponse(conversationPrompt);

        res.status(200).send({
            bot: reply,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error || 'Something went wrong');
    }
});

app.listen(5000, () => console.log('AI server started on http://localhost:5000'));