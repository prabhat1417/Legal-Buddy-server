import express from "express";
import Query from "../models/query.model.js";
import lawyerData from "../models/lawyer.data.model.js";
import userAuth from "../models/user.auth.model.js";
import multer from 'multer';
import lawyerAuth from "../models/lawyer.auth.model.js";
import path from "path";
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
const serviceRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// serviceRouter.post("/bookLawyer", async (req, res) => {
//   try {
//     const {
//       CUSTOMER_PHONE_NUMBER,
//       LAWYER_PHONE_NUMBER,
//       LAWYER_EMAIL,
//       CREATED_ON,
//       SERVICE_CATEGORY,
//       SERVICE_CHARGE,
//       SERVICE_DESCRIPTION,
//       ISPRIVATE,
//     } = req.body;

//     if (
//       !CUSTOMER_PHONE_NUMBER ||
//       !LAWYER_PHONE_NUMBER ||
//       !LAWYER_EMAIL ||
//       !CREATED_ON ||
//       !SERVICE_CATEGORY ||
//       typeof SERVICE_CHARGE !== "number" ||
//       !SERVICE_DESCRIPTION ||
//       typeof ISPRIVATE !== "boolean"
//     ) {
//       return res.status(400).json({
//         status: "error",
//         message: "Invalid or missing fields in the request",
//       });
//     }

//     const newQuery = new Query({
//       CUSTOMER_PHONE_NUMBER,
//       LAWYER_PHONE_NUMBER,
//       LAWYER_EMAIL,
//       CREATED_ON,
//       SERVICE_CATEGORY,
//       SERVICE_CHARGE,
//       SERVICE_DESCRIPTION,
//       ISPRIVATE,
//     });

//     const savedQuery = await newQuery.save();
//     // console.log("saved query: ", savedQuery);
//     const currLawyer = await lawyerData.findOne({
//       EMAIL: newQuery.LAWYER_EMAIL,
//     });

//     // console.log("current lawyer: ", currLawyer);

//     if (!currLawyer) {
//       return res.status(500).json({
//         status: "error",
//         message: "An invalid lawyer email",
//       });
//     }

//     const newUserQuery = {
//       QUERY_ID: savedQuery._id,
//       CUSTOMER_PHONE_NUMBER: newQuery.CUSTOMER_PHONE_NUMBER,
//     };

//     // console.log("new user query: ", newUserQuery);

//     // added new customer into lawyer data
//     const x = currLawyer.BOOKED_BY.push(newUserQuery);
//     await currLawyer.save();
//     console.log("x: ", x);

//     // console.log("current lawyer: ", currLawyer);

//     // customer who made request
//     const currUser = await userAuth.findOne({
//       PHONE_NUMBER: newQuery.LAWYER_PHONE_NUMBER,
//     });

//     if (!currUser) {
//       return res.status(500).json({
//         status: "error",
//         message: "An invalid lawyer email",
//       });
//     }

//     const newLawyerBooking = {
//       QUERY_ID: savedQuery._id,
//       LAWYER_PHONE_NUMBER: newQuery.LAWYER_PHONE_NUMBER,
//     };

//     currUser.MYORDERS.push(newLawyerBooking);
//     await currUser.save();

//     res.status(200).json({
//       status: "success",
//       message: "Service booked successfully",
//     });
//   } catch (error) {
//     // console.error(error);
//     res.status(500).json({
//       status: "error",
//       message: "An error occurred while processing the request",
//     });
//   }
// });

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

serviceRouter.post("/getLawyerData", async (req, res) => {

  try {

    const {
      EMAIL,
      MOBILENUMBER
    } = req.body;
  
    if(!EMAIL && !MOBILENUMBER) {
      res.status(401).json({
        status: "Invalid request",
        message: "Phone number or email is required",
      });
      return;
    }
    
    // currently searching for email field, that is in postman put email id in MOBILENUMBER field
    const lawyer = await lawyerData.findOne({ EMAIL });
    if(!lawyer) lawyer = await lawyerData.findOne({ MOBILENUMBER });
  
    if(!lawyer) {
      res.status(401).json({
        status: "Invalid phone numer",
        message: "Lawyer wiht this phone number or email id does not exist",
      });
      return;
    }
  
    res.status(200).json({
      status: "success",
      message: "Fetched data successfully",
      data: lawyer
    });
    
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request",
    });
  }

})

serviceRouter.post('/upload/:id', upload.single('file'), async (req, res) => {
  const id = req.params.id;
  try{
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const lawyer = await lawyerAuth.findOne({MOBILENUMBER: id});
    const file = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };
    lawyer.uploadedFiles = file;
    const result = await lawyer.save()
    if (!result) {
        console.error(err);
        return res.status(500).send('Error saving file to database.');
    }
    return res.status(200).send('File uploaded successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading file.');
  }
});

serviceRouter.get('downloadfiles/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const lawyer = await lawyerAuth.findOne({ MOBILENUMBER: id });
    if (!lawyer) {
      return res.status(404).send('Lawyer not found.');
    }
    const uploadedFile = lawyer.uploadedFiles;
    if (!uploadedFile) {
      return res.status(404).send('No file uploaded for this lawyer.');
    }
    res.setHeader('Content-Type', uploadedFile.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="BarCertificate_${id}"`);
    res.send(uploadedFile.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving file.');
  }
});

serviceRouter.post('/uploadProfilePic/:id', upload.single('file'), async (req, res) => {
  const id = req.params.id;
  try{
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const user = await userAuth.findOne({PHONE_NUMBER: id});
    const file = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };
    user.PROFILE_PIC = file;
    const result = await user.save();
    if (!result) {
        console.error(err);
        return res.status(500).send('Error saving file to database.');
    }
    return res.status(200).send('File uploaded successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading file.');
  }
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

serviceRouter.use('/profile-pics', express.static(path.join(__dirname, 'profile-pics')));

serviceRouter.get('/profile-pic/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const userData = await userAuth.findOne({ PHONE_NUMBER: id }).select('PROFILE_PIC');
    if (!userData || !userData.PROFILE_PIC || !userData.PROFILE_PIC.data) {
      return res.status(404).send('Profile picture not found');
    }
    const profilePicData = Buffer.from(userData.PROFILE_PIC.data.buffer);
    const filename = `profile-pic-${id}.jpg`;
    const profilePicsDir = path.join(__dirname, 'profile-pics');
    await fs.mkdir(profilePicsDir, { recursive: true });
    const profilePicPath = path.join(profilePicsDir, filename);
    await fs.writeFile(profilePicPath, profilePicData);
    const profilePicUrl = `/profile-pics/${filename}`;
    res.json({ profilePicUrl });
  } catch (error) {
    console.error('Error generating profile picture URL:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default serviceRouter;
