import { connectToDB } from "@/lib/mongodb";
import User from "@/models/user.model";
import { ApiResponse } from "@/types/api.types";
import { RegisterBody } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";
import { generateJWT } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body: RegisterBody = await req.json();

    if(!body) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "All fields are required",
        },
        {
          status: 400,
        },
      );
    }

    const { name, email, password, mobile } = body;

    if (!name || !email || !password || !mobile) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "All fields are required",
        },
        {
          status: 400,
        },
      );
    }

    const isExisting = await User.findOne({ email });

    if (isExisting) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists with the same email",
        },
        { status: 409 },
      );
    }

    const newUser = await User.create({ name, email, password, mobile });

    const token = generateJWT({ userId: newUser._id.toString() });

    const response = NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "User registered",
        data: {
          user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
          },
        },
      },
      { status: 201 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    return response;
  } catch (error) {
    console.log("Error in register api: ", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Error occured while registering user",
        error: { error }
      },
      { status: 500 },
    );
  }
}
