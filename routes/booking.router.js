import express from "express";
import queryModel from "../models/query.model.js";

const bookingRouter = express.Router();

bookingRouter.post("/bookLawyer", async (req, res) => {
  try {
    const {
      CUSTOMER_MOBILENUMBER,
      LAWYER_MOBILENUMBER,
      SERVICE_CHARGE,
      SERVICE_CATEGORY,
      SERVICE_DESCRIPTION,
    } = req.body;

    const newqueryData = new queryModel({
      CUSTOMER_MOBILENUMBER,
      LAWYER_MOBILENUMBER,
      SERVICE_CHARGE,
      SERVICE_CATEGORY,
      SERVICE_DESCRIPTION,
    });
    const randomID = Math.floor(100000 + Math.random() * 900000);
    newqueryData.ID = randomID.toString();
    newqueryData.CREATED_ON = Date.now();
    await newqueryData.save();

    res.status(200).json({
      status: "success",
      message: "Query saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request",
    });
  }
});

bookingRouter.post("/getLawyerBookings", async (req, res) => {
  try {
    const { LAWYER_MOBILENUMBER } = req.body;

    if(!LAWYER_MOBILENUMBER) {
      res.status(401).json({
        status: "error",
        message: "Lawyer phone number is required",
      });
      return;
    }

    const queries = await queryModel
      .find({ LAWYER_MOBILENUMBER: LAWYER_MOBILENUMBER })
      .sort({ CREATED_ON: -1 });

    res.status(200).json({
      status: "success",
      message: "Query fetched successfully",
      data: queries,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request",
    });
  }
});

bookingRouter.post("/getCustomerBookings", async (req, res) => {
  try {
    const { CUSTOMER_MOBILENUMBER } = req.body;

    if(!CUSTOMER_MOBILENUMBER) {
      res.status(401).json({
        status: "error",
        message: "Customer phone number is required",
      });
      return;
    }

    const queries = await queryModel
      .find({ CUSTOMER_MOBILENUMBER: CUSTOMER_MOBILENUMBER })
      .sort({ CREATED_ON: -1 });

    res.status(200).json({
      status: "success",
      message: "Query fetched successfully",
      data: queries,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request",
    });
  }
});

export default bookingRouter;
