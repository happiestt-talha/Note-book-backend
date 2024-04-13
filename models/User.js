const mongoose=require('mongoose')
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    asliPassword:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})
//added 'authUsers' as third arg to specify collection name in iNoteBook
module.exports=mongoose.model('User',UserSchema,'authUsers')