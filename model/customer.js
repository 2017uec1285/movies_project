const joi =require('joi');
const mongoose=require('mongoose');
const Customer=mongoose.model('Customer',new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50
    },
    phone:{
        type:String,
        required:true,
        maxlength:12,
        minlength:5,
    },
    isGold:{
        type:Boolean,
        default:false
    }
}));
function valid(customer){
    const schema={
         name:joi.string().min(3).required(),
         phone:joi.string().min(5).max(12).required(),
         isGold:joi.boolean()    
    };
    return joi.validate(customer,schema);
}
exports.Customer=Customer;
exports.valid=valid;