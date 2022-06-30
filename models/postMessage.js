import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title: String,
    description: String,
    name : String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likes : {
        type : [String],
        default : []
    },
    comments: {type: [String], default: []},
    createdAt : {
        type : Date,
        default: new Date()
    },
    location : String,
    eventDate : String,
    contactInformation : String
});

const postMessage = mongoose.model('PostMessage', postSchema);

export default postMessage
