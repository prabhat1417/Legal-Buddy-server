import express from 'express';
import Feedback from '../models/feedback.model.js';
const FeedBackRouter = express.Router();

FeedBackRouter.post('/AddFeedback', async (req, res) => {
    const { lawyer_id, user_id, feed, rating } = req.body;

    try {
        if (!lawyer_id || !user_id || !feed || !rating) {
            return res.status(400).json({
                status: "failed",
                message: "All fields are required"
            });
        }

        const newFeedback = new Feedback({
            LAWYER_MOBILENUMBER: lawyer_id,
            CUSTOMER_MOBILENUMBER: user_id,
            TIME: Date.now(),
            MESSAGE: feed,
            RATING: rating
        });
        await newFeedback.save();
        res.status(200).json({
            status: "success",
            message: "Feedback added successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while processing the request"
        });
    }
});




// Calculate and return the average rating and the number of people who gave feedback for a lawyer
FeedBackRouter.get('/AverageRating/:lawyer_id', async (req, res) => {
    const lawyerId = req.params.lawyer_id;
    // console.log(lawyerId)

    try {
        // Find all feedback entries for the specified lawyer
        const lawyerFeedback = await Feedback.find({ LAWYER_MOBILENUMBER: lawyerId });

        if (lawyerFeedback.length === 0) {
            return res.status(404).json({
                status: "failed",
                message: "No feedback found for the specified lawyer"
            });
        }

        // Calculate the average rating
        const totalRatings = lawyerFeedback.reduce((sum, feedback) => sum + feedback.RATING, 0);
        const averageRating = totalRatings / lawyerFeedback.length;

        // Get the number of unique users who provided feedback
        const uniqueUserIds = new Set(lawyerFeedback.map(feedback => feedback.CUSTOMER_MOBILENUMBER));
        const numberOfPeople = uniqueUserIds.size;

        res.status(200).json({
            status: "success",
            averageRating: averageRating,
            numberOfPeople: numberOfPeople
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while processing the request"
        });
    }
});

export default FeedBackRouter;
