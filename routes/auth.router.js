import express from "express";
import UserAuth from "../models/user.auth.model.js";
import feedback from "../models/feedback.model.js";
const userRouter = express.Router();

userRouter.post("/addFeedback", async (req, res) => {
    try {
        const new_obj = {
            LAWYER_ID: req.body.lawyer,
            USER_ID: req.body.user,
            FEEDBACK: req.body.feedback,
            RATING: req.body.rating
        }
        console.log(new_obj);
        const event = await new feedback(new_obj).save();

        if (event) {
            return res.status(200).send({
                Message: "feedback created successfully",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(404).send({
            Message: "Error in Event Creation",
        });
    }
});

export default userRouter;

