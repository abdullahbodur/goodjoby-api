const mongoose = require("mongoose");

// == == == == == == == == == == == == == == == == == == == ==
// CONNECT DATABASE 
// == == == == == == == == == == == == == == == == == == == ==


const connectDatabase = () => {
  mongoose 
    .connect(process.env.***REMOVED***, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false, 
      useCreateIndex: true,
    })
    .then(() => console.log("MongoDb Connection is succesfully"))
    .catch((err) => console.error(err));
};

module.exports = connectDatabase;
 