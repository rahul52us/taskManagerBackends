import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectToDatabase = async (): Promise<mongoose.Connection> => {
  try {
    const uri: string = process.env.MONGODB_URI!;
    const options: any = {
      useUnifiedTopology: true,
    };
    await mongoose.connect('mongodb+srv://rahulkush5225:Rahul52us@cluster0.uku04rj.mongodb.net/taskManager', options);
    console.log('Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (error : any) {
    console.error('Error connecting to MongoDB Atlas:', error?.message);
    throw error;
  }
};

connectToDatabase();
