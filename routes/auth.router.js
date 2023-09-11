import express from "express";
import bcrypt from "bcrypt";
import UserAuth from "../models/user.auth.model.js";
const userRouter = express.Router();

// Route for user login
userRouter.post("/userlogin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: "failed",
            message: "Both email and password are required"
        });
    }

    try {
        const user = await UserAuth.findOne({ EMAIL: email });

        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User not found"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.PASSWORD);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: "failed",
                message: "Invalid password"
            });
        }

        res.send("You have successfully logged in.");

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while processing the request"
        });
    }
});

// Route for user registration/sign-up
userRouter.post("/usersignin", async (req, res) => {
    const { first_name, last_name, password, phone_number, email } = req.body;
      console.log(req.body);
    try {
        if (!first_name || !last_name || !password || !phone_number || !email) {
            return res.status(400).json({
                status: "failed",
                message: "All fields are required"
            });
        }

        const checkEmail = await UserAuth.findOne({ EMAIL: email });

        if (checkEmail) {
            return res.send("Account already registered. Please log in.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserAuth({
            FIRST_NAME: first_name,
            LAST_NAME: last_name,
            PASSWORD: hashedPassword,
            PHONE_NUMBER: phone_number,
            EMAIL: email
        });
        // console.log(newUser)

        await newUser.save();
        res.send("successfully signin")
        // res.redirect("/home");

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while processing the request"
        });
    }
});

export default userRouter;
