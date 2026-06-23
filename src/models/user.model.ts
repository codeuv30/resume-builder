import { IUser } from "@/types/user.types";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Document } from "mongoose";

interface UserDocument extends Omit<IUser, "_id">, Document {
  comparePassword(candidatePassword: string): boolean
}

const userSchema = new mongoose.Schema<UserDocument>({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true,
  },
  mobile: {
    type: String,
    required: [true, "Mobile is required"],
    trim: true,
    minlength: [10, "Min 10 characters required in mobile number"],
    maxlength: [10, "Max 10 characters required in mobile number"],
  },
}, { timestamps: true });

userSchema.pre("save", function(): void {
  if(!this.isModified("password")) return;

  this.password = bcrypt.hashSync(this.password, 10)
});

userSchema.methods.comparePassword = function(candidatePassword: string): boolean {
  return bcrypt.compareSync(candidatePassword, this.password);
}

const User = mongoose.model("users", userSchema);

export default User;
