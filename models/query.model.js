import mongoose from 'mongoose';

const querySchema=new mongoose.Schema({
    CUSTOMER_PHONE_NUMBER:{
        type:String,
        require:true,
    },
    LAWYER_PHONE_NUMBER:{
        type:String,
        require:true,
    },
    LAWYER_EMAIL: {
        type:String,
        require:true,
    },
    CREATED_ON:{
        type:String,
        require:true
    },
    SERVICE_CATEGORY:{
        type:String,
        require:true
    },
    SERVICE_CHARGE:{
        type:Number,
        require:true,
        length:10,
    },
    SERVICE_DESCRIPTION:{
        type:String,
        require:true,
    },
    ISPRIVATE:{
        type:Boolean,
        default:false
    }

})

const query = mongoose.model('QuerySchema',querySchema);

export default query;