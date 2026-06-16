import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const createToken = (id)=>{
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// route for user login
const loginUser = async(req,res)=>{
    try{

        const {email,password} = req.body;

        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"user not found"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if (isMatch) {
          const token = createToken(user._id);
          res.json({ success: true, token });
        } else {
          res.json({ success: false,message: "Invalid password" });
        }
    }catch(error){
        console.log(error);
        console.log("user is not login")
        res.json({success:false,message:"Error"})
    }
}

// Route for user register
const registerUser = async(req,res)=>{
    try {
      const { name, email, password } = req.body;
      // Check if the user already exists in the database
      const exists = await userModel.findOne({ email });
      if (exists) {
        return res.json({ success: false, message: "User already exists" });
      }
      // validating email format & strong password
      if (!validator.isEmail(email)) {
        return res.json({
          success: false,
          message: "please enter a valid email address",
        });
      }
      if (password.length < 8) {
        return res.json({
          success: false,
          message: "please enter a valid password (minimum 8 characters)",
        });
      }
      // Hash the password before saving it to the database
      const salt = await bcrypt.genSalt(10); // genSalt is used to generate a random string that is used to hash the password. The number 10 is the number of rounds that the salt will be generated. The higher the number, the more secure the password will be, but it will also take more time to hash the password.
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new userModel({ name, email, password: hashedPassword });
      const user = await newUser.save();
      const token = createToken(user._id);
      res.json({ success: true, token });
    } catch (error) {
      
      res.json({ success: false, message: error.message });
    }
}

// route for admin login
const adminLogin = async(req,res)=>{
    try{
        const {email,password} = req.body;
         if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET); 
            res.json({success:true,token})
         }else{
            res.json({success:false,message:"Invalid email or password"})
         }
    }catch(error){
        res.json({ success: false, message: "Error" });
    }
}

export { loginUser,registerUser,adminLogin }