const {Rental,validRental}=require('../model/rental');
const {Movie}=require('../model/movie');
const {Customer}=require('../model/customer');
const mongoose=require('mongoose');
const Fawn =require('fawn');
const express=require('express');
const router=express.Router();
Fawn.init(mongoose);
router.get('/',async (req,res)=>{
    const rentals=await Rental.find().sort('-dateOut');
    res.send(rentals);
});
router.post('/',async (req,res)=>{
    const {error}=validRental(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const customer=await Customer.findById(req.body.customerId);
    if(!customer)return res.status(400).send('Invalid customer id.');
    const movie=await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid movie id.');
    if(movie.numberInStock===0)return res.status(400).send('Movie not in stack.');
    
    let rental=new Rental({
        customer:{
            _id:customer._id,
            name:customer.name,
            phone:customer.phone
        },
        movie:{
            _id:movie._id,
            title:movie.title,
            dailyRetalRate:movie.dailyRetalRate
        }
    });
    try{
        new Fawn.Task()
        .save('rentals',rental)
        .update('movies',{_id:movie._id},{
         $inc:{numberInStock:-1}
     })
     .run();
      res.send(rental);
    }
    catch(ex){
        res.status(500).send('Somthing failed.');
    }
    
});
/*
router.delete('/:id',async (req,res)=>{
    const rental=await Rental.findByIdAndRemove(req.params.id);
    
    if(!rental)return res.status(404).send('data not found');

    return res.send(rental);
});
router.put('/:id',async (req,res)=>{
    const {error}=validRental(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer=await Customer.findById(req.body.customerId);
    if(!customer)return res.status(400).send('Invalid customer id.');
    const movie=await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid movie id.');
    
    const rental=Rental.findByIdAndUpdate(req.params.id,{
        customer:{
            _id:customer._id,
            name:customer.name,
            phone:customer.phone
        },
        movie:{
            _id:movie._id,
            title:movie.title,
            dailyRetalRate:movie.dailyRetalRate
        }
    },
    {
        new:true
    });
    if(!rental)return res.status(404).send('data not found');

    return res.send(rental);
});
*/
router.get('/:id',async (req,res)=>{
    const rental=await Rental.findById(req.params.id);
    if(!rental)res.status(404).send('data not found');

    res.send(rental);
});
module.exports=router;