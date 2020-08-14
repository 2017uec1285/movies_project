const {Movie,validMovie}=require('../model/movie');
const {Genre}=require('../model/genre');
const auth=require('../middleware/auth');
const admin =require('../middleware/admin');
const validateObjectId=require('../middleware/validateObjectId');
const express=require('express');
const router=express.Router();

router.get('/',async (req,res)=>{
    const movies=await Movie.find().sort('name');
    res.send(movies);
});
router.post('/',async (req,res)=>{
    const {error}=validMovie(req.body);
    
    if(error) return res.status(400).send(error.details[0].message);    
    let genre=await Genre.findById(req.body.genreId);
    
    if(!genre)return res.status(400).send('Invalid genre.');
    let movie=new Movie({
        title:req.body.title,
        genre:{
            _id:genre._id,
            name:genre.name
        },
        numberInStock:req.body.numberInStock,
        dailyRentalRate:req.body.dailyRentalRate
    });
    movie=await movie.save();
    genre=await genre.save();
    res.send(movie);
});
router.delete('/:id',[auth,admin],async (req,res)=>{
    const movie=await Movie.findByIdAndRemove(req.params.id);
    
    if(!movie)return res.status(404).send('data not found');

    return res.send(movie);
});
router.put('/:id',validateObjectId ,auth,async (req,res)=>{
    const {error}=validMovie(req.body);
    if(error)return res.status(404).send(error.details[0].message);
    
    const genre=await Genre.findById(req.body.genreId);
    if(!genre)return res.status(400).send('Invalid genre.');
    const movie=await Movie.findByIdAndUpdate(req.params.id,{
        title:req.body.title,
        genre:{
            _id:genre._id,
            name:genre.name
        },
        numberInStock:req.body.numberInStock,
        dailyRentalRate:req.body.dailyRentalRate
    },{
        new:true
    });
    
    if(!movie)return res.status(404).send('data not found');

    return res.send(movie);
});


router.get('/:id',validateObjectId,async (req,res)=>{
    const movie=await Movie.findById(req.params.id).select('-_v');
    if(!movie)res.status(404).send('data not found');

    res.send(movie);
});
function valid(genre){
    const schema={
         name:joi.string().min(3).required()        
    };
    return Joi.validate(genre,schema);
}
module.exports=router;