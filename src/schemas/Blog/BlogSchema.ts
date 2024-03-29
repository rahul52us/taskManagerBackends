import mongoose, { Document, Schema } from "mongoose";

interface Reaction {
  user: mongoose.Schema.Types.ObjectId;
  type: string;
}

interface Blog extends Document {
  title: string;
  coverImage: string;
  content: string;
  createdBy: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId;
  tags: string[];
  reactions: Reaction[];
  status:string;
  comments: mongoose.Types.ObjectId[];
  createdAt:Date,
  updatedAt:Date
}

const blogSchema = new Schema<Blog>(
  {
    title: {
      type: String,
      required: true,
      index:true
    },
    coverImage: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [String], // Tags array
    status:{
      type : String,
      enum : ['draft','published'],
      default : 'draft'
    },
    reactions: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
      },
    ],
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "BlogComment",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    createdAt:{
      type : Date,
      default : new Date()
    },
    updatedAt:{
      type : Date
    }
  },
  { timestamps: true }
);

const BlogModel = mongoose.model<Blog>("Blog", blogSchema);

export default BlogModel;
