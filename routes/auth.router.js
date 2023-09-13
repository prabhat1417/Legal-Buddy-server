import express from "express";
import bcrypt from "bcrypt";
import UserAuth from "../models/user.auth.model.js";
import loggers from "../config/loggersConfig.js";
import lawyerAuth from "../models/lawyer.auth.model.js";
const authRouter = express.Router();

// Route for user login
authRouter.post("/userLogin", async (req, res) => {
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
authRouter.post("/userSignup", async (req, res) => {
    const { first_name, last_name, phone_number,email,password} = req.body;
      console.log(req.body);
    try {
        if (!first_name || !last_name || !password || !phone_number || !email) {
            return res.status(400).json({
                status: "failed",
                message: "All fields are required"
            });
        }

        if (!/^\d{10}$/.test(phone_number)) {
            return res.status(400).json({
                status: "failed",
                message: "Phone number must be exactly 10 digits"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                status: "failed",
                message: "Password must be at least 6 characters long"
            });
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid email format"
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
        res.send("successfully SignUp")
        // res.redirect("/home");

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while processing the request"
        });
    }
});

// Route for Lawyer Registratin/Signup
authRouter.post("/lawyerSignup", async (req, res) => {

    try {

        const {
            FIRSTNAME,
            LASTNAME,
            PASSWORD,
            MOBILENUMBER,
            EMAIL,
            GENDER,
            STATE,
            CITY,
            BAR_COUNCIL_ID,
            ID_NUMBER,
            YEAR
        } = req.body;

        if (
            !FIRSTNAME ||
            !LASTNAME ||
            !PASSWORD ||
            !MOBILENUMBER ||
            !EMAIL ||
            !GENDER ||
            !STATE ||
            !CITY ||
            !BAR_COUNCIL_ID ||
            !ID_NUMBER ||
            !YEAR
        ) {
            loggers.error('Lawyer signup failed: Missing required fields', { body: req.body });
            return res.status(400).json({
                status: "failed",
                message: "All fields are required"
            });
        }

        if (MOBILENUMBER.length !== 10 || !/^\d+$/.test(MOBILENUMBER)) {
            loggers.error('User signup failed: Invalid phone number format', { mobileNumber: MOBILENUMBER });
            return res.status(400).json({
                status: "failed",
                message: "Invalid phone number format. It should be exactly 10 digits."
            });
        }

        const checkEmail = await lawyerAuth.findOne({ EMAIL });

        if (checkEmail) {
            loggers.info('Lawyer signup failed: Account already registered', { email: EMAIL });
            return res.status(400).json({
                status: "failed",
                message: "Account already registered. Please log in."
            });
        }        

        const pastUser = await UserAuth.findOne({ PHONE_NUMBER: MOBILENUMBER });
        if(pastUser) {
            pastUser.ISLAWYER = true;
            await pastUser.save();
        }

        const hashedPassword = await bcrypt.hash(PASSWORD, 10);

        const newLawyer = new lawyerAuth({
            FIRSTNAME,
            LASTNAME,
            PASSWORD: hashedPassword,
            MOBILENUMBER,
            EMAIL,
            GENDER,
            STATE,
            CITY,
            BAR_COUNCIL_ID,
            ID_NUMBER,
            YEAR
        });

        await newLawyer.save();
        loggers.info('Lawyer signed up successfully', { email: EMAIL });
        res.status(201).json({
            status: "success",
            message: "Lawyer registration successful",
            data: {
                email: EMAIL
            }
        });
        

    } catch (error) {
        loggers.error('Lawyer signup error', { error });
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while processing the request"
        });
    }
});

// Route for lawyer login
authRouter.post("/lawyerLogin", async (req, res) => {

    const {
        EMAIL,
        PASSWORD
    } = req.body;

    try {
        if(
            !EMAIL ||
            !PASSWORD
        ) {
            loggers.error('Lawyer login failed: Missing required fields', { body: req.body });
            return res.status(400).json({
                status: "failed",
                message: "EMail or Password cannot be empty"
            });
        }

        const foundLawyer = await lawyerAuth.findOne({ EMAIL });

        if (!foundLawyer) {
            loggers.error('Lawyer is not registered: ', { body: req.body });
            return res.status(400).json({
                status: "failed",
                message: `${EMAIL} does bot exist. Please signup first`
            });
        }

        // decrypting and then comapring 
        const isPasswordValid = await bcrypt.compare(PASSWORD, foundLawyer.PASSWORD);

        if (!isPasswordValid) {
            loggers.error('Invalid password for lawyer', { email: EMAIL });
            return res.status(400).json({
                status: "failed",
                message: "Invalid username or password"
            });
        }

        // for future to add token
        // const token = generateToken(foundLawyer);

        res.json({
            status: "success",
            message: "Authentication successful",
        });

    } catch (error) {
        loggers.error('Lawyer login error', { error });
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while processing the request"
        });
    }

})

export default authRouter;
