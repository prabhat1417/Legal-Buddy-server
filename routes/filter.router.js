import express from "express";
import lawyerData from "../models/lawyer.data.model.js";

const filterRouter = express.Router();

filterRouter.post("/filterLawyer", async (req, res) => {
  try {
    const { LOCATION, LANGUAGES, SPECIALITIES } = req.body;

    const filter = {};

    if (Array.isArray(LOCATION) && LOCATION.length > 0) {
      filter.LOCATION = { $in: LOCATION };
    }

    if (Array.isArray(LANGUAGES) && LANGUAGES.length > 0) {
      filter.LANGUAGES = { $in: LANGUAGES };
    }

    if (Array.isArray(SPECIALITIES) && SPECIALITIES.length > 0) {
      filter.SPECIALITIES = { $in: SPECIALITIES };
    }

    const filteredLawyers = await lawyerData.find(filter);

    res.status(200).json({
      status: "success",
      message: "Lawyers data filtered successfully",
      data: filteredLawyers,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request",
    });
  }
});

export default filterRouter;
