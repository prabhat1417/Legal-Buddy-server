import mongoose from 'mongoose';

const userAuthSchema=new mongoose.Schema({
    FIRST_NAME:{
        type:String,
        require:true,
    },
    LAST_NAME:{
        type:String,
        require:true,
    },
    PHONE_NUMBER:{
        type:Number,
        require:true,
        length:10,
    },
    EMAIL:{
        type:String,
        require:true,
        
    },
    My_Orders:{
       type:[String]

    }

})

const userAuth = mongoose.model('UserAuth',userAuthSchema);

export default userAuth;