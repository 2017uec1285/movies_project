const joi =require('joi');
const mongoose=require('mongoose');
const genreSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50
    }
});
const Genre=mongoose.model('Genre',genreSchema);
function validGenre(genre){
    const schema={
         name:joi.string().min(5).max(50).required(),   
    };
    return joi.validate(genre,schema);
}
exports.genreSchema=genreSchema;
exports.Genre=Genre;
exports.validGenre=validGenre;