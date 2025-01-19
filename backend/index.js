    const express =require('express')
    const cors = require('cors');
    const port=3000;

    const bodyParser =require('body-parser');
    const { OpenAI } = require('openai');
    const Sentiment = require('sentiment');

// Initialize Sentiment Analysis tool
const sentiment = new Sentiment();
    //Create express app
    const app= express();
    //bodyparser middleware to join incoming msg to json

    app.use(cors());
    app.use(bodyParser.json())

    // Using bodyParser middleware to parse incoming requests as URL Data 
    app.use(bodyParser.urlencoded({ extended: true }));


    // Setting up OpenAI API 
    const openai = new OpenAI({
        //replace ur API key here
        apiKey: ''
    })
   
    //sentiment analysis on input text
    app.post('/converse', async (request, response) => {
        console.log('Received:', request.body);
        const message = request.body.message
        // Perform Sentiment Analysis on User's message
    const sentimentResult = sentiment.analyze(message);
    console.log('Sentiment Result:', sentimentResult);

    // Add sentiment score to message
    const sentimentScore = sentimentResult.score;
    // Prepare message for OpenAI API
    const openaiResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: message }],
    });
    // Extract the chatbot's response
    const botMessage = openaiResponse.choices[0].message;

    // Send sentiment analysis result and the chatbot's response to frontend
    response.send({
        reply: botMessage.content,
        sentimentScore: sentimentScore,  // Send sentiment score to frontend
    });
    })


    // Handling Incoming requests for noram chatbot feature without Sentiment Analysis
   /* app.post('/converse', async (request, response) => {
        console.log('Received:', request.body);


        // Extracting user's message from the prompt
        const message = request.body.message;

        // Calling openAI API 
        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: message }],
        })

        response.send({ reply: chatCompletion.choices[0].message.content });
        console.log(chatCompletion.choices[0].message.content);
    })
        */

    // Listen to app on PORT
    app.listen(port, 'localhost',() => {
        console.log(`App is listening to port ${port}`);
    })