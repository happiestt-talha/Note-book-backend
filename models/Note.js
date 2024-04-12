const mongoose=require('mongoose')
const noteSchema=new mongoose.Schema({
    // user:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'User'
    // },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    tag:{
        type:String,
        default:'Genral'
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('Note',noteSchema,'notes')