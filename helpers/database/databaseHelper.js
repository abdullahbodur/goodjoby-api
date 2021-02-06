const mongoose = require("mongoose");

// == == == == == == == == == == == == == == == == == == == ==
// CONNECT DATABASE 
// == == == == == == == == == == == == == == == == == == == ==


const connectDatabase = () => {
  mongoose 
    .connect(process.env.MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false, 
      useCreateIndex: true,
    })
    .then(() => console.log("MongoDb Connection is succesfully"))
    .catch((err) => console.error(err));
};

module.exports = connectDatabase;
 