import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password_hash?: string;
  full_name: string;
  student_id?: string;
  major?: string;
  is_verified: boolean;
  fcm_token?: string;
  notifications_enabled: boolean;
  google_id?: string;
  facebook_id?: string;
  role: 'user' | 'admin' | 'superadmin';
  created_at: Date;
  updated_at: Date;
  comparePassword(plain: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password_hash: { type: String, select: false },
    full_name: { type: String, required: true, trim: true },
    student_id: { type: String, trim: true },
    major: { type: String, trim: true },
    is_verified: { type: Boolean, default: false },
    fcm_token: { type: String },
    notifications_enabled: { type: Boolean, default: true },
    google_id: { type: String, sparse: true },
    facebook_id: { type: String, sparse: true },
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

userSchema.index({ email: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password_hash") || !this.password_hash) return next();
  this.password_hash = await bcrypt.hash(this.password_hash, 10);
  next();
});

userSchema.methods.comparePassword = async function (
  plain: string,
): Promise<boolean> {
  if (!this.password_hash) return false;
  return bcrypt.compare(plain, this.password_hash);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password_hash;
  return obj;
};

export const User = mongoose.model<IUser>("User", userSchema);

