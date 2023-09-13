import express from "express";
import Query from "../models/query.model.js";
import lawyerData from "../models/lawyer.data.model.js";
import userAuth from "../models/user.auth.model.js";
const serviceRouter = express.Router();

// Route for booking service

serviceRouter.post("/bookLawyer", async (req, res) => {
  try {
    const {
      CUSTOMER_PHONE_NUMBER,
      LAWYER_PHONE_NUMBER,
      LAWYER_EMAIL,
      CREATED_ON,
      SERVICE_CATEGORY,
      SERVICE_CHARGE,
      SERVICE_DESCRIPTION,
      ISPRIVATE,
    } = req.body;

    if (
      !CUSTOMER_PHONE_NUMBER ||
      !LAWYER_PHONE_NUMBER ||
      !LAWYER_EMAIL ||
      !CREATED_ON ||
      !SERVICE_CATEGORY ||
      typeof SERVICE_CHARGE !== "number" ||
      !SERVICE_DESCRIPTION ||
      typeof ISPRIVATE !== "boolean"
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or missing fields in the request",
      });
    }

    const newQuery = new Query({
      CUSTOMER_PHONE_NUMBER,
      LAWYER_PHONE_NUMBER,
      LAWYER_EMAIL,
      CREATED_ON,
      SERVICE_CATEGORY,
      SERVICE_CHARGE,
      SERVICE_DESCRIPTION,
      ISPRIVATE,
    });

    const savedQuery = await newQuery.save();
    // console.log("saved query: ", savedQuery);
    const currLawyer = await lawyerData.findOne({
      EMAIL: newQuery.LAWYER_EMAIL,
    });

    // console.log("current lawyer: ", currLawyer);

    if (!currLawyer) {
      return res.status(500).json({
        status: "error",
        message: "An invalid lawyer email",
      });
    }

    const newUserQuery = {
      QUERY_ID: savedQuery._id,
      CUSTOMER_PHONE_NUMBER: newQuery.CUSTOMER_PHONE_NUMBER,
    };

    // console.log("new user query: ", newUserQuery);

    // added new customer into lawyer data
    const x = currLawyer.BOOKED_BY.push(newUserQuery);
    await currLawyer.save();
    console.log("x: ", x);

    // console.log("current lawyer: ", currLawyer);

    // customer who made request
    const currUser = await userAuth.findOne({
      PHONE_NUMBER: newQuery.LAWYER_PHONE_NUMBER,
    });

    if (!currUser) {
      return res.status(500).json({
        status: "error",
        message: "An invalid lawyer email",
      });
    }

    const newLawyerBooking = {
      QUERY_ID: savedQuery._id,
      LAWYER_PHONE_NUMBER: newQuery.LAWYER_PHONE_NUMBER,
    };

    currUser.MYORDERS.push(newLawyerBooking);
    await currUser.save();

    res.status(200).json({
      status: "success",
      message: "Service booked successfully",
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request",
    });
  }
});

serviceRouter.post("/saveLawyerData", async (req, res) => {
  try {
    // Extract lawyer data from the request body
    const {
      FIRSTNAME,
      LASTNAME,
      EMAIL,
      SERVICE_CHARGE,
      BIO,
      EXPERIENCE,
      LANGUAGES,
      LOCATION,
      SPECIALITIES,
      BOOKED_BY,
      CASES_ASSIGNED,
      CASES_SOLVED,
    } = req.body;

    const newLawyerData = new lawyerData({
      FIRSTNAME,
      LASTNAME,
      EMAIL,
      SERVICE_CHARGE,
      BIO,
      EXPERIENCE,
      LANGUAGES,
      LOCATION,
      SPECIALITIES,
      BOOKED_BY,
      CASES_ASSIGNED,
      CASES_SOLVED,
    });

    await newLawyerData.save();

    res.status(200).json({
      status: "success",
      message: "Lawyer data saved successfully",
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request",
    });
  }
});

export default serviceRouter;
