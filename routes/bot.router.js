import express from "express";
import {botResponse} from "../methods/categoryRecommendation.js";


const botRouter = express.Router();

botRouter.post("/botResponse", async (req, res) => {
  try {
    const { message } = req.body;

    const botMessage = await botResponse(message);

    res.status(200).json({
      status: "success",
      message: "Bot replied successfully",
      data: botMessage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request",
    });
  }
});


export default botRouter;
