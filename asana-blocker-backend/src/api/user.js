import Users from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const SECRET_KEY = "jwt";

// Create &SignUp User
export const userSignup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(403).json({ msg: "Please Enter All Fields" });
    }
    try {
        let check = await Users.findOne({ email }).maxTimeMS(30000);
        if (check) {
            return res.status(400).json({ msg: "Email already registered" });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new Users({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });
        const result = await newUser.save();
        return res.status(201).json({ result, msg: "User Created Successfully" });
    } catch (error) {
        console.log(error);
        // Handle the error and send an appropriate response
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

// User Login
export const userLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(403).json({ msg: "Please Enter All Fields" });
    }
    try {
        const user = await Users.findOne({ email }).maxTimeMS(30000); // Increase the timeout value if needed
        if (!user) {
            return res.status(403).json({ msg: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid password" });
        }
        const token = jwt.sign({ email }, SECRET_KEY);
        return res.status(200).json({ user, token, msg: "User Login Successfully" });
    } catch (error) {
        console.log(error);
        // Handle the error and send an appropriate response
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

export const getUserById = async (req, res) => {
  const user = await Users.find(req.params)
  res.send(user)
}
// GetAll
export const getAllUsers = async (req, res) => {
  let data = await Users.find();
  res.send(data)
}

// update user
export const updateUser = async (req, res) => {
    let updateData = req.body;
    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(updateData.password, 12);
      updateData.password = hashedPassword;
    }
  
    try {
      let data = await Users.findByIdAndUpdate(
        { _id: req.params._id },
        { $set: updateData },
        { new: true }
      );
      if (data) {
        res.status(200).json({ message: "User data updated successfully" });
      } else {
        res.status(404).json({ message: "User data not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
