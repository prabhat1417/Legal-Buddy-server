import mongoose from "mongoose"

const lawyerAuthSchema = new mongoose.Schema({
    FIRSTNAME: {
        type: String,
        required: true
    },
    LASTNAME: {
        type: String,
        required: true
    },
    EMAIL: {
        type: String,
        required: true
    },
    MOBILENUMBER: {
        type: String,
        required: true
    },
    PASSWORD: {
        type: String,
        required: true
    },
    GENDER: {
        type: String,
        required: true
    },
    STATE: {
        type: String,
        required: true
    },
    CITY: {
        type: String,
        required: true
    },
    BAR_COUNCIL_ID: {
        type: String,
        required: true
    },
    ID_NUMBER: {
        type: String,
        required: true
    },
    YEAR: {
        type: String,
        required: true
    },
    uploadedFiles:{
        data: Buffer,      
        contentType: String
    }
});

const lawyerAuth = mongoose.model('LawyerAuth', lawyerAuthSchema);

export default lawyerAuth;
