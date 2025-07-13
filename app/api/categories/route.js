import { getCategories } from "@/queries/categories";
import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";

export const GET = async (request) => {
    await dbConnect();

    try {
        const categories = await getCategories();

        return new NextResponse(JSON.stringify(categories), {
            status: 200,
        });

    } catch (err) {
        return new NextResponse(err.message, {
            status: 500,
        });
    }

};