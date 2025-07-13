import { CourseDetailsIntro } from "./_components/CourseDetailsIntro";
import { CourseDetails } from "./_components/CourseDetails";
import Testimonials from "./_components/Testimonials";
import { RelatedCourses } from "./_components/RelatedCourses";
import { getCourseDetails, getRelatedCourses } from "@/queries/courses";
import { replaceMongoIdInArray } from "@/lib/convertData";
import MoneyBack from '@/components/home/MoneyBack';

const SingleCoursePage = async ({ params }) => {
  const { id } = await params;
  const course = await getCourseDetails(id);

  const currentCourseId = course.id.toString();
  const categoryId = course.category._id.toString();

  // Fetch related courses
  const relatedCourses = await getRelatedCourses(currentCourseId, categoryId);

  return (
    <>
      <CourseDetailsIntro course={course} />
      <CourseDetails course={course} />
      {course?.testimonials && (
        <Testimonials
          testimonials={replaceMongoIdInArray(course?.testimonials)}
        />
      )}
      <div>
        <MoneyBack />
      </div>
      <div>
        <RelatedCourses relatedCourses={relatedCourses} />
      </div>
    </>
  );
};

export default SingleCoursePage;
