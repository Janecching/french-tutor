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
// , language, level, scenario
async function generateChatResponse(conversation) {
    try {

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: `You are a french waiter. Use basic french to serve user, provide english translation and correct user's grammar.` },
                { role: "user", content: conversation },
            ],
        });
        // console.log(response.data.choices)
        const reply = response.data.choices[0].message.content.trim();
        return reply;
    } catch (error) {
        // console.error(error);
        throw error;
    }
}


app.get('/', async(req, res) => {
    // console.log('GET request received');
    res.status(200).send({
        message: 'Hello from your french tutor!',
    });
})

app.post('/', async(req, res) => {
    try {
        // console.log('POST request received');
        const conversation = req.body.conversation;
        const language = req.body.language;
        const level = req.body.level;
        const scenario = req.body.scenario;

        console.log('Conversation:', conversation);
        console.log('Language:', language);
        console.log('Level:', level);
        console.log('Scenario:', scenario);

        const reply = await generateChatResponse(
            conversation,
            // language,
            // level,
            // scenario
        );

        console.log('Bot reply:', reply);

        res.status(200).send({
            bot: reply,
        });
    } catch (error) {
        // console.error(error);
        res.status(500).send(error || 'Something went wrong');
    }
});
app.listen(5000, () => console.log('AI server started on http://localhost:5000'));