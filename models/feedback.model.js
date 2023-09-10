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

const Lawyer = mongoose.model('Lawyer', lawyerSchema);

export default Lawyer;

