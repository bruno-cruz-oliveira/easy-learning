import { getCourseDetails } from "@/queries/courses";
import { columns } from "./_components/Columns";
import { DataTable } from "./_components/DataTable";
import { getInstructorDashboardData, ENROLLMENT_DATA } from "@/lib/dashboard-helper";
import { ObjectId } from 'mongoose';

const EnrollmentsPage = async ({params}) => {
  const { courseId } = await params;
  const course = await getCourseDetails(courseId);
  const allEnrollments = await getInstructorDashboardData(ENROLLMENT_DATA);

  const enrollmentData = sanitizeData(allEnrollments);

  const enrollmentForCourse = enrollmentData.filter((enrollment) => enrollment?.course?.toString() === courseId)

  return (
    <div className="p-6">
      {/* <Link href="/teacher/create">
        <Button>New Course</Button>
      </Link> */}
      <h2 className="text-3xl text-gray-700 font-bold">{course?.title}</h2>
      <DataTable columns={columns} data={enrollmentForCourse} />
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

export default EnrollmentsPage;
