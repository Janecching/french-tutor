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

async function generateChatResponse(conversation, language, level, scenario) {
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: `You are a ${language} ${scenario}. Use ${level} ${language} to serve user, provide english translation, correct user's grammar, then provide a natural follow up question in ${level} ${language}` },
                { role: "user", content: conversation },
            ],
        });
        const reply = response.data.choices[0].message.content.trim();
        return reply;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


app.get('/', async(req, res) => {
    res.status(200).send({
        message: 'Hello from your french tutor!',
    });
})

app.post('/', async(req, res) => {
    try {
        const conversation = req.body.conversation;
        const language = req.body.language;
        const level = req.body.level;
        const scenario = req.body.scenario;

        const reply = await generateChatResponse(
            conversation,
            language,
            level,
            scenario
        );

        console.log('Bot reply:', reply);

        res.status(200).send({
            bot: reply,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error || 'Something went wrong');
    }
});
app.listen(5000, () => console.log('AI server started on http://localhost:5000'));