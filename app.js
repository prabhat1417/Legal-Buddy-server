import express from 'express';
import { connectToDatabase } from './config/DatabaseConfig.js';
import authRouter from './routes/auth.router.js';
import serviceRouter from './routes/user.router.js';
import bookingRouter from './routes/booking.router.js';
import FeedbackRouter from './routes/feedback.router.js'
import feedRouter from './routes/feed.router.js';
import filterRouter from './routes/filter.router.js';
import cors from 'cors'
import categoryRecommendation from './methods/categoryRecommendation.js';
import sendEmail from './routes/mailSender.router.js';

connectToDatabase();
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

// home api to check if backend is live or not!
app.get('/', (req, res) => {
    res.send(`Hi! Current time is ${new Date().toLocaleTimeString()}`);
});

// authentication related apis
app.use(authRouter);


// mixed apis
app.use(serviceRouter);

app.use(bookingRouter);

app.use(FeedbackRouter)

app.use(feedRouter);

app.use(filterRouter);

// categoryRecommendation("My land was illegaly captured");

app.listen(port, () => {
 console.log(`Listening on port: ${port}`)
})
