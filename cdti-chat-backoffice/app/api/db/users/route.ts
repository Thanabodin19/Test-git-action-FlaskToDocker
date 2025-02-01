import User from "@/models/user";
import { connectDB } from "@/utils/db/mongodb";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDB();
    const users = await User.find();
    const filterUsers = users.map(({ name, email, role }, idx) => ({
      key: idx,
      name,
      email,
      role,
    }));
    return NextResponse.json(
      {
        message: "Get Users successfully",
        data: filterUsers,
        total: filterUsers.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Cannot get users ${error}` },
      { status: 500 }
    );
  }
};
