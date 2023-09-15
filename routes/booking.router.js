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
      const randomID = Math.floor(
        100000 + Math.random() * 900000
      ); 
      newqueryData.ID = randomID.toString();
      newqueryData.CREATED_ON = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
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

  export default bookingRouter;
