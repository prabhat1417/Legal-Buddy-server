import express from "express";
import lawyerData from "../models/lawyer.data.model.js";

const feedRouter = express.Router();

feedRouter.get("/getLawyersFeed", async (req, res) => {
  try {
    const lawyers = await lawyerData.find().lean().sort({
      EXPERIENCE: -1,
      CASES_SOLVED: -1,
    });

    res.status(200).json(
    lawyers,
    );
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request",
    });
  }
});

export default feedRouter;
