import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import { LoginBody } from "@/types/user.types";
import { generateJWT } from "@/lib/jwt";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body: LoginBody = await req.json();

    const { email, password } = body;

    if (!email || !password) {
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

    if (!isExisting) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect email or password",
        },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect email or password",
        },
        { status: 400 },
      );
    }

    const isMatch = user.comparePassword(password);

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect email or password",
        },
        { status: 400 },
      );
    }

    const token = generateJWT({ userId: user._id.toString() });

    const response = NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "User logged in",
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    return response;
  } catch (error) {
    console.log("Error in login api: ", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Error occured while registering user",
        error: { error },
      },
      { status: 500 },
    );
  }
}
