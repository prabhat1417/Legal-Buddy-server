import express from "express";
import S3 from "aws-sdk/clients/s3.js";
import Query from "../models/query.model.js";
import lawyerData from "../models/lawyer.data.model.js";
import userAuth from "../models/user.auth.model.js";
import multer from "multer";
import lawyerAuth from "../models/lawyer.auth.model.js";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";
const serviceRouter = express.Router();

const s3 = new S3({
  region: process.env.region,
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
});
const uploadFile = (file) => {
  const fileStream = fs.createReadStream(file.path);
  const BucketParams = {
    Bucket: process.env.Bucket,
    Body: fileStream,
    Key: file.filename,
  };
  return s3.upload(BucketParams).promise();
};
const getfile = (key) => {
  const downloadParams = {
    Key: key,
    Bucket: process.env.Bucket,
  };
  return s3.getObject(downloadParams).createReadStream();
};

const uploadoptions = multer({ dest: "./imgfolder/" });

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, PDF,DOCX,txt and PPT files are allowed."
        )
      );
    }
  },
});

serviceRouter.post(
  "/uploadfile/:id",
  upload.single("file"),
  async (req, res) => {
    try {
      const lawyer = req.params.id;
      const file = req.file;
      if (!lawyer || !file) {
        throw new Error("Invalid request.");
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size exceeds the 5 MB limit.");
      }
      const params = {
        Bucket: process.env.Bucket,
        Body: file.buffer,
        Key: file.originalname,
      };

      const s3Result = await s3.upload(params).promise();

      const File = await lawyerAuth.findOne({ MOBILENUMBER: lawyer });
      File.uploadedFiles = s3Result.Location;
      const updatedFile = await File.save();
      res.status(200).send({
        message: "File path updated successfully.",
        updatedFilePath: File.uploadedFiles,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: error.message,
      });
    }
  }
);

serviceRouter.get("/downloadfile/:id", async (req, res) => {
  try {
    const lawyer = req.params.id;

    const File = await lawyerAuth.findOne({ MOBILENUMBER: lawyer });
    if (!File) {
      throw new Error("File not found.");
    }
    const filePath = File.uploadedFiles;
    res.status(200).send({
      filePath: filePath,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: error.message,
    });
  }
});

serviceRouter.post(
  "/uploadProfilePic/:id",
  upload.single("file"),
  async (req, res) => {
    try {
      const user = req.params.id;
      const file = req.file;
      if (!user || !file) {
        throw new Error("Invalid request.");
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size exceeds the 5 MB limit.");
      }
      const File = await userAuth.findOne({ MOBILENUMBER: user });
      const params = {
        Bucket: process.env.Bucket,
        Body: file.buffer,
        Key: file.originalname,
      };

      const s3Result = await s3.upload(params).promise();

      File.PROFILE_PIC = s3Result.Location;
      const updatedFile = await File.save();
      res.status(200).send({
        message: "File path updated successfully.",
        updatedFilePath: File.PROFILE_PIC,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: error.message,
      });
    }
  }
);

serviceRouter.get("/profilePicUrl/:id", async (req, res) => {
  try {
    const user = await userAuth.findOne({
      MOBILENUMBER: req.params.id,
    });

    if (user) {
      if (!user.PROFILE_PIC) {
        res.status(200).send({
          Message: "No Image",
        });
      } else {
        res.status(200).send({
          Message: user.PROFILE_PIC,
        });
      }
    }
  } catch (error) {
    res.status(404).send({
      Message: "No Image",
    });
  }
});

serviceRouter.post("/saveLawyerData", async (req, res) => {
  try {
    const {
      FIRSTNAME,
      LASTNAME,
      EMAIL,
      MOBILENUMBER,
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

    if (!MOBILENUMBER) {
      return res.status(400).json({
        status: "error",
        message: "Bad request! MOBILENUMBER is required.",
      });
    }

    const foundLawyer = await lawyerData.findOne({
      MOBILENUMBER: MOBILENUMBER,
    });

    if (!foundLawyer) {
      return res.status(404).json({
        status: "error",
        message: "Lawyer not found.",
      });
    }

    if (FIRSTNAME) {
      foundLawyer.FIRSTNAME = FIRSTNAME;
    }
    if (LASTNAME) {
      foundLawyer.LASTNAME = LASTNAME;
    }
    if (SERVICE_CHARGE) {
      foundLawyer.SERVICE_CHARGE = SERVICE_CHARGE;
    }
    if (BIO) {
      foundLawyer.BIO = BIO;
    }
    if (EXPERIENCE) {
      foundLawyer.EXPERIENCE = EXPERIENCE;
    }
    if (LANGUAGES) {
      foundLawyer.LANGUAGES = LANGUAGES;
    }
    if (LOCATION) {
      foundLawyer.LOCATION = LOCATION;
    }
    if (SPECIALITIES) {
      foundLawyer.SPECIALITIES = SPECIALITIES;
    }
    if (CASES_ASSIGNED) {
      foundLawyer.CASES_ASSIGNED = CASES_ASSIGNED;
    }
    if (CASES_SOLVED) {
      foundLawyer.CASES_SOLVED = CASES_SOLVED;
    }

    await foundLawyer.save();

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
    const { MOBILENUMBER } = req.body;

    if (!MOBILENUMBER) {
      res.status(401).json({
        status: "Invalid request",
        message: "Phone number is required",
      });
      return;
    }

    // currently searching for email field, that is in postman put email id in MOBILENUMBER field
    const lawyer = await lawyerData.findOne({ MOBILENUMBER });

    if (!lawyer) {
      res.status(401).json({
        status: "Invalid phone numer",
        message: "Lawyer wiht this phone number or email id does not exist",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Fetched data successfully",
      data: lawyer,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request",
    });
  }
});

export default serviceRouter;
