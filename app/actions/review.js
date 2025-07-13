"use server"

import { Course } from "@/model/course-model";
import { Testimonial } from "@/model/testimonial-model";

export async function createReview(data, loginId, courseId){
    const { review, rating} = data;

    try {
        const newTestimonial = await Testimonial.create({
            content: review,
            user: loginId,
            courseId,
            rating,
        })

        if (!newTestimonial) {
            throw new Error("Failed to create a testimonial")   
        }

        // Update the course to include the testimonial id
        const updateCourse = await Course.findByIdAndUpdate(
            courseId,
            { $push: {testimonial: newTestimonial._id}},
            {new: true}
        )

        if (!newTestimonial) {
            throw new Error("Failed to update the course testimonial")   
        }

        return newTestimonial
    } catch (error) {
        throw new Error(error);
    }
}