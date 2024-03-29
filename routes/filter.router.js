import express from "express";
import lawyerData from "../models/lawyer.data.model.js";
import {categoryRecommendation} from "../methods/categoryRecommendation.js";

const filterRouter = express.Router();

filterRouter.post("/filterLawyer", async (req, res) => {
  try {
    const { LOCATION, LANGUAGES, SPECIALITIES, QUERY } = req.body;

    console.log(QUERY);

    const filter = {};
    if (QUERY && QUERY.length > 0) {
      let recommendedSpecialities = await categoryRecommendation(QUERY);
      console.log("hii");
      console.log(recommendedSpecialities);
      

      // Push the recommended specialities into the SPECIALITIES array
      if (recommendedSpecialities.length > 0) {
        SPECIALITIES.push(recommendedSpecialities);
      }
    }

    if (Array.isArray(SPECIALITIES) && SPECIALITIES.length > 0) {
      filter.SPECIALITIES = SPECIALITIES;
    }

    console.log("filter parameteres: ", filter.SPECIALITIES);
    if (Array.isArray(LOCATION) && LOCATION.length === 1) {
      filter.LOCATION = LOCATION[0];
    }

    if (Array.isArray(LANGUAGES) && LANGUAGES.length > 0) {
      filter.LANGUAGES = { $in: LANGUAGES };
    }

    if (Array.isArray(SPECIALITIES) && SPECIALITIES.length > 0) {
      filter.SPECIALITIES = { $in: SPECIALITIES };
    }

    const filteredLawyers = await lawyerData.find();
   
    const matchedLawyers = filteredLawyers.filter((lawyer) => {
      if(!filter.LANGUAGES && !filter.LOCATION && !filter.SPECIALITIES)
      return filteredLawyers;
      const matchedLanguages = lawyer.LANGUAGES.some((language) =>
        LANGUAGES.includes(language)
      );
      if(!filter.SPECIALITIES && !filter.LOCATION)
      return matchedLanguages;
      const matchedSpecialties = lawyer.SPECIALITIES.some((specialty) =>
        SPECIALITIES.includes(specialty)
      );
      if(!filter.LANGUAGES && !filter.LOCATION)
      return matchedSpecialties;
      const matchedLocation = lawyer.LOCATION === LOCATION[0];
      if(!filter.LANGUAGES && !filter.SPECIALITIES)
      return matchedLocation;
      if(!filter.LANGUAGES)
      return matchedLocation && matchedSpecialties;
      if(!filter.LOCATION)
      return matchedLanguages && matchedSpecialties;
      if(!filter.SPECIALITIES)
      return matchedLanguages && matchedLocation;
      return matchedLanguages && matchedSpecialties && matchedLocation;
    });

    res.status(200).json(
      matchedLawyers,
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request",
    });
  }
});


export default filterRouter;
