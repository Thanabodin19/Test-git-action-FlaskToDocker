import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import * as Yup from "yup";
import YupPassword from "yup-password";
YupPassword(Yup);
import { connectDB } from "@/utils/db/mongodb";
import User from "@/models/user";

interface UserData {
  email: string;
  password: string;
  name: string;
  role: string;
}

const userDataSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().password().required("Password is required"),
  name: Yup.string().required("Name is required"),
  role: Yup.string(),
});

// Sign up new user to DB
export const POST = async (request: Request) => {
  try {
    const body: UserData = await request.json();
    try {
      const { email, password, name, role } = await userDataSchema.validate(
        body,
        {
          abortEarly: false,
        }
      );
      const hashed_password = await bcrypt.hash(password, 16);

      const userData = {
        email,
        password: hashed_password,
        name,
        role,
      };

      await connectDB();
      const newUser = new User(userData);
      const doc = await newUser.save();

      return NextResponse.json(
        {
          message: "User is created successfully",
          data: doc,
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json({ message: error }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: `User cannot be created ${error}` },
      { status: 500 }
    );
  }
};
