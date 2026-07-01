const mongoose = require("mongoose");
const dotenv = require("dotenv");
mongoose.set("strictQuery", false);
dotenv.config();

const url = process.env.MONGODB_URI;
mongoose.connect(url, { family: 4 });

console.log("connecting to", url);
mongoose
  .connect(url, { family: 4 })

  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

// 1. Correct Schema for a Phonebook Entry
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "name is required"],
    minlength: [3, "name must be at least 3 characters long"],
  },
  number: {
    type: String,
    required: [true, "number is required"],
    minlength: [8, "number must be at least 3 characters long"],
    validate: {
      validator: v => /^\d{2,3}-\d+$/.test(v)  ,
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
