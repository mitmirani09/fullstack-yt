import { app } from './app.js';
import connectDB from './db/index.js';



connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, (err) => {
            if(err){
                console.log("Server startup error!")
                process.exit(1);
            }
            console.log("Server started listening on port:", process.env.PORT)
        })
    })
    .catch((err) => {
        console.log("Mongodb connection failed!!", err)
    })