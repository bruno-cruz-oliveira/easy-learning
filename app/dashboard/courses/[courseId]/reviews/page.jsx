import { getCourseDetails } from "@/queries/courses";
import { columns } from "./_components/Columns";
import { DataTable } from "./_components/DataTable";
import { getInstructorDashboardData, REVIEW_DATA } from "@/lib/dashboard-helper";
import { ObjectId } from 'mongoose';

const ReviewsPage = async ({params}) => {
  const { courseId } = await params;
  const course = await getCourseDetails(courseId);
  const rawReviewData = await getInstructorDashboardData(REVIEW_DATA);

  const reviewData = sanitizeData(rawReviewData);

  const reviewDataForCourse = reviewData.filter((review) => review?.courseId?.toString() === courseId)
  console.log(reviewDataForCourse)

  return (
    <div className="p-6">
      <h2 className="text-3xl text-gray-700 font-bold">{course?.title}</h2>
      <DataTable columns={columns} data={reviewDataForCourse} />
    </div>
  );
};

function sanitizeData(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (value instanceof ObjectId) {
          return value.toString();
      }
      if (Buffer.isBuffer(value)) {
        return value.toString("base64")
      }
      return value;
    })
  );
}

export default ReviewsPage;
