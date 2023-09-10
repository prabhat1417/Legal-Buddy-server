import mongoose from "mongoose"

const lawyerSchema = new mongoose.Schema({
    FIRSTNAME: {
        type: String,
    },
    LASTNAME: {
        type: String,
    },
    CITY: {
        type: String, 
    },
    STATE: {
        type: String, 
    },
    TIME: {
        type: String, 
    },
    FEEDBACK: {
        type: String,
    }
});

module.exports = mongoose.model('Lawyer', lawyerSchema);
