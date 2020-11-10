const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const QuestionFilterSchema = new Schema({
  question: {
    type: String,
    required: [true, "Please provide a sector name"],
    maxlength: [100, "Question must be 100 characters or fewer"],
  },
  answers: [
    {
      type: String,
      unique: [true, "This Answer is same another"],
    },
  ],
  definition: {
    type: String,
    maxlength: [150, "Definition must be 100 characters or fewer"],
  },
}); 

module.exports = mongoose.model("QuestionFilter", QuestionFilterSchema);
