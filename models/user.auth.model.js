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
    PASSWORD:{
        type:String,
        require:true
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
    ISLAWYER:{
        type:Boolean,
        default:false
    },
    MYORDERS: [
        {
            QUERY_ID: {
                type: String,
                required: true
            },
            LAWYER_PHONE_NUMBER: {
                type: String,
                required: true
            }
        }
    ],

})

const userAuth = mongoose.model('UserAuth',userAuthSchema);

export default userAuth;