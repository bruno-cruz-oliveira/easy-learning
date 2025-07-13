import { getCourses, getCoursesList } from "@/queries/courses";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request) => {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const arrayCategoryIds = searchParams.has('filters')? searchParams.get('filters').split("_") : null;
    const priceParam = searchParams.has('price')? searchParams.get('price') : null;
    
    const title = searchParams.has('search')? searchParams.get('search') : null;
    const categoryIds = arrayCategoryIds? arrayCategoryIds.map((categoryId) => new mongoose.Types.ObjectId(categoryId)) : null;
    const price = { minPrice: null, maxPrice: null };
    const sort = { sortBy: 'price', sortOrder: searchParams.has('sort')? searchParams.get('sort') : 1 };

    priceParam === 'paid'? price.minPrice = 0 : price.maxPrice = 0;

    try {
        const courses = await getCourses(title, categoryIds, price, sort);;

        return new NextResponse(JSON.stringify(courses), {
            status: 200,
        });

    } catch (err) {
        return new NextResponse(err.message, {
            status: 500,
        });
    }

};