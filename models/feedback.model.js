import mongoose from "mongoose"

const feedbackSchema = new mongoose.Schema({
    LAWYER_ID: {
        type: String,
    },
    USER_ID: {
        type: String,
    },
    TIME: {
        type: String, 
    },
    FEEDBACK: {
        type: String,
    },
    RATING: {
        type: Number,
    }
});

const feedback = mongoose.model("feedback", feedbackSchema);
export default feedback;

