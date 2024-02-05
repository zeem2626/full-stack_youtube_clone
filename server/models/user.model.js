import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
   {
      fullName: {
         type: String,
         required: true,
      },
      userName: {
         type: String,
         required: true,
         unique: true,
         trim: true,
         lowercase: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
         trim: true,
         lowercase: true,
      },
      googleUserId: {
         type: String,
         default: null,
      },
      password: {
         type: String,
         //  required: true,
      },
      avatar: {
         type: String,
      },
      subscribers: {
         type: [String],
         default: [],
      },
      subscribedChannels: {
         type: [String],
         default: [],
      },
      // subscribers: [mongoose.Schema.Types.ObjectId],
   },
   { timestamps: true }
);

userSchema.pre("save", async function (next) {
   if (this.isModified("password"))
      this.password = await bcrypt.hash(this.password, 10);
   next();
});

userSchema.methods.isPasswordCorrect = async function (oldPassword) {
   return await bcrypt.compare(oldPassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
   return jwt.sign(
      {
         _id: this._id,
         email: this.email,
         username: this.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
         expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
   );
};

const User = mongoose.model("User", userSchema);

export { User };
