const User=require('../models/User');
const jwt=require('jsonwebtoken');

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE});
}
exports.register=async(req,res)=>{
    try{
        const {name,email,phone,password}=req.body;
        const userExists=await User.findOne({$or:[{email},{phone}]})
        if(userExists){
            return res.status(400).json({
                success:false,
                message:'User already exist'
            });
        }
        const user=await User.create({name,email,phone,password});
        const token=generateToken(user._id);

        res.status(201).json({
            success:true,
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                role:user.role,
                balance:user.balance
            }
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

exports.login=async(req,res)=>{
    try{
        const{email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:'please provide email and password'
            });
        }
        const user=await User.findOne({email});
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({
                success:false,
                message:'Invalid credentials'
            });
        }
        const token=generateToken(user._id);
        res.status(200).json({
            success:true,
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                role:user.role,
                balance:user.balance,
                rewardPoints:user.rewardPoints
            }
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }

};

exports.getMe=async(req,res)=>{
    try{
        const user=await User.findById(req.user.id).select('-password');
        res.status(200).json({success:true,user})
    }catch(error){
        res.status(500).json({success:false,message:error.message})
    }
};