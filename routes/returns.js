const express=require('express');
const auth=require('../middleware/auth');
const {Rental}=require('../model/rental');
const moment=require('moment');
const router=express.Router();
router.post('/',auth,async (req,res)=>{
  if(!req.body.customerId)
   return res.status(400).send('not customer id');
  if(!req.body.movieId)
   return res.status(400).send('not movie id');

   const rental=await Rental.findOne({
     'customer._id':req.body.customerId,
     'movie._id':req.body.movieId
   });
   if(!rental) return res.status(404).send('Invalid rental.');
   if(rental.dateReturned)
    return res.status(400).send('date is already set')
   rental.dateReturned=new Date();
   const rentalDays=moment().diff(rental.dateOut,'days');

   rental.rentalFee=rentalDays*rental.movie.dailyRentalRate;
   await rental.save();
   return res.status(200).send();
});
module.exports=router;