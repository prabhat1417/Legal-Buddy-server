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
    EMAIL: {
        type: String,
        required: true
    },
    MOBILENUMBER: {
        type: String,
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
    BOOKED_BY: [
        {
            QUERY_ID: {
                type: String,
                required: true
            },
            CUSTOMER_PHONE_NUMBER: {
                type: String,
                required: true
            }
        }
    ],
    CASES_ASSIGNED: {
        type: Number
    },
    CASES_SOLVED: {
        type: Number
    }

});

const lawyerData = mongoose.model('LawyerData', lawyerDataSchema);
export default lawyerData;