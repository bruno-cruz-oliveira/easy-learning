import { Category } from "@/model/category-model";
import { Course } from "@/model/course-model";
import { Testimonial } from "@/model/testimonial-model";
import { User } from "@/model/user-model";
import { Module } from './../model/module-model';
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { getEnrollmentsForCourse } from "./enrollments";
import { getTestimonialsForCourse } from "./testimonials";
import { Lesson } from "@/model/lesson-model";
import { Quizset } from "@/model/quizset-model";
import { Quiz } from "@/model/quizzes-model";
import mongoose from "mongoose";

export async function getCoursesList() {
    const courses = await Course.find({ active: true }).select(["title", "subtitle", "thumbnail", "modules", "price", "category", "instructor"]).populate({
        path: "category",
        model: Category
    }).populate({
        path: "instructor",
        model: User
    }).populate({
        path: "testimonials",
        model: Testimonial
    }).populate({
        path: "modules",
        model: Module
    }).lean();

    return replaceMongoIdInArray(courses);
}

export async function getCourseDetails(id) {
    const course = await Course.findById(id)
        .populate({
            path: "category",
            model: Category
        }).populate({
            path: "instructor",
            model: User
        }).populate({
            path: "testimonials",
            model: Testimonial,
            populate: {
                path: "user",
                model: User
            }
        }).populate({
            path: "modules",
            model: Module,
            populate: {
                path: "lessonIds",
                model: Lesson
            }
        }).populate({
            path: "quizSet",
            model: Quizset,
            populate: {
                path: "quizIds",
                model: Quiz,
            }
        }).lean();

    return replaceMongoIdInObject(course);
}

function groupBy(array, keyFn) {
    return array.reduce((acc, item) => {
        const key = keyFn(item);

        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);

        return acc;
    }, {});
}

export async function getCourseDetailsByInstructor(instructorId, expand) {
    const publishCourses = await Course.find({ instructor: instructorId, active: true })
        .populate({ path: "category", model: Category })
        .populate({ path: "testimonials", model: Testimonial })
        .populate({ path: "instructor", model: User })
        .lean();

    const enrollments = await Promise.all(
        publishCourses.map(async (course) => {
            const enrollment = await getEnrollmentsForCourse(course._id.toString());

            return enrollment;
        })
    );

    // Group enrollments by course 
    const groupByCourses = groupBy(enrollments.flat(), (item) => item.course);

    // Calculate total revenue
    const totalRevenue = publishCourses.reduce((acc, course) => {
        const enrollmentsForCourse = groupByCourses[course._id] || [];

        return acc + enrollmentsForCourse.length * course.price;
    }, 0);

    const totalEnrollments = enrollments.reduce((acc, obj) => {
        return acc + obj.length;
    }, 0);

    const testimonials = await Promise.all(
        publishCourses.map(async (course) => {
            const testimonial = await getTestimonialsForCourse(course._id.toString());

            return testimonial;
        })
    );

    const totalTestimonials = testimonials.flat();

    const avgRating = (totalTestimonials.reduce(function (acc, obj) {
        return acc + obj.rating;
    }, 0)) / totalTestimonials.length;

    const firstName = publishCourses.length > 0 ? publishCourses[0]?.instructor?.firstName : "Unknown";
    const lastName = publishCourses.length > 0 ? publishCourses[0]?.instructor?.lastName : "Unknown";
    const fullInsName = `${firstName} ${lastName}`;

    const Designation = publishCourses.length > 0 ? publishCourses[0]?.instructor?.designation : "Unknown";
    const insImage = publishCourses.length > 0 ? publishCourses[0]?.instructor?.profilePicture : "Unknown";

    if (expand) {
        const allCourses = await Course.find({ instructor: instructorId }).lean();
        return {
            "courses": allCourses?.flat(),
            "enrollments": enrollments?.flat(),
            "reviews": totalTestimonials,
        };
    }

    return {
        "courses": publishCourses.length,
        "enrollments": totalEnrollments,
        "reviews": totalTestimonials.length,
        "ratings": avgRating.toPrecision(2),
        "inscourses": publishCourses,
        "revenue": totalRevenue,
        fullInsName,
        Designation,
        insImage
    };
}

export async function create(courseData) {
    try {
        const course = await Course.create(courseData);
        return JSON.parse(JSON.stringify(course));
    } catch (err) {
        throw new Error(err);
    }
}

export async function getCoursesByCategory(categoryId) {
    try {
        const courses = await Course.find({ category: categoryId }).populate("category").lean();

        return courses;
    } catch (error) {
        throw new Error(error);
    }
}

export const getCategoryById = async (categoryId) => {
    try {
        const category = await Category.findById(categoryId);

        return category;
    } catch (error) {
        throw new Error(error);
    }
};

export async function getRelatedCourses(currentCourseId, categoryId) {
    try {
        const currentCourseObjectId = new mongoose.Types.ObjectId(currentCourseId);
        const categoryObjectId = new mongoose.Types.ObjectId(categoryId);

        const relatedCourses = await Course.find({
            category: categoryObjectId,
            _id: { $ne: currentCourseObjectId }, // Exclude current course
            active: true,
        })
            .select("title thumbnail price").lean();

        return relatedCourses;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getCoursesByTitle(title) {
    try {
        const courses = await Course.find({
            title: { $regex: title, $options: 'i' },
            active: true,
        }).lean();

        return courses;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getCourses(title, categoryIds, price, sort) {
    const query = {
        active: true,
    };
    const sortOptions = {};
    const priceQuery = {};

    const { minPrice = null, maxPrice = null } = price;
    const { sortBy = 'price', sortOrder = 1 } = sort;


    if (title) {
        query.title = { $regex: title, $options: 'i' };
    }

    if (categoryIds && categoryIds.length > 0) {
        query.category = { $in: categoryIds };
    }

    if (minPrice !== null && typeof minPrice === 'number') {
        priceQuery.$gte = minPrice;
    }

    if (maxPrice !== null && typeof maxPrice === 'number') {
        priceQuery.$lte = maxPrice;
    }

    if (Object.keys(priceQuery).length > 0) {
        query.price = priceQuery;
    }

    if (sortBy) {
        sortOptions[sortBy] = sortOrder === -1? -1 : 1;
    }

    try {
        const courses = await Course.find(query).sort(sortOptions).lean();

        return courses;
    } catch (error) {
        throw new Error(error);
    }
}