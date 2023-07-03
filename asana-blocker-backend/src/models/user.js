import mongoose from "mongoose";

const UserSignUpSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String,
    }
    ,
    phoneNumber: {
        type: String,
    }
})
const Users = mongoose.model('Users', UserSignUpSchema)

export default Users;