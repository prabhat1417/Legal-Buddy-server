import mongoose from "mongoose"

const lawyerDataSchema = new mongoose.Schema({
    FIRSTNAME: {
        type: String,
        required: true
    },
    LASTNAME: {
        type: String,
        required: true
    },
    SERVICE_CHARGE: {
        type: String
    },
    BIO: {
        type: String
    },
    EXPERIENCE: {
        type: String
    },
    LANGUAGES: {
        type: [String]
    },
    LOCATION: {
        type: String
    },
    SPECIALITIES: {
        type: [String]
    },
    BOOKED_BY: {
        type: [String]
    },
    CASES_ASSIGNED: {
        type: Number
    },
    CASES_SOLVED: {
        type: Number
    }

});

const lawyerData = mongoose.model('LawyerData', lawyerDataSchema);
export default lawyerData;