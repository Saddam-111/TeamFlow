import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const connectDB = async () => {
  console.log('MONGODB_URI:', process.env.MONGODB_URI);
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/teamflow';
  console.log('Connecting to:', uri);
  
  try {
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected successfully');
    
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
