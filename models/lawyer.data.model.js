import mongoose from "mongoose"

const lawyerDataSchema = new mongoose.Schema({
    
});

const lawyerData = mongoose.model('LawyerData', lawyerDataSchema);

export default lawyerData;
