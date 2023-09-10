import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

main().catch((err) => console.log(err));
async function main() {
  const url = process.env.URL;
  const dbPath = "/legalbuddy";
  await mongoose.connect(url + dbPath, {
    useNewUrlParser: true,
  });
  console.log('Conneted To Mongodb Databse');
}

export default main;