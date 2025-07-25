import { dbConnect } from "@/service/mongo";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/model/user-model";

export const POST = async (request) => {
    const {firstName, lastName, email, password, userRole} = await request.json();

    await dbConnect();
    const hashedPassword = await bcrypt.hash(password, 5)

    const newUser = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: userRole
    }

    try {
        await User.create(newUser);

        return new NextResponse("User has been created", {
            status: 201,
        });
    } catch (error) {
        return new NextResponse(error.message, {
            status: 201,
        });
    }
}