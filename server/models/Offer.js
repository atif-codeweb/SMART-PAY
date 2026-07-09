const mongoose=require('mongoose')

const offerSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    discount:Number,
    cashback:Number,
    category:{
        type:String,
        enum:['transfer','bill_payment','recharge','all'],
        default:'all'
    },
    validFrom:Date,
    validTo:Date,
    isActive:{
        type:Boolean,
        default:false
    },
    image:String,

},{
    timestamps:true
});

module.exports=mongoose.model('Offer',offerSchema);