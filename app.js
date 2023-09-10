import express from 'express';
import main from './config/DatabaseConfig.js'
const port = process.env.PORT || 3000;
const app = express();
     
app.listen(port, () => {
 console.log(`Listening on port: ${port}`)
})


