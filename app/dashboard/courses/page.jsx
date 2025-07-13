import { COURSE_DATA, getInstructorDashboardData } from "@/lib/dashboard-helper";
import { columns } from "./_components/Columns";
import { DataTable } from "./_components/DataTable";
import { ObjectId } from "mongoose";

const CoursesPage = async () => {
  const courses = sanitizeData(await getInstructorDashboardData(COURSE_DATA));

  return (
    <div className="p-6">
      {/* <Link href="/teacher/create">
        <Button>New Course</Button>
      </Link> */}
      <DataTable columns={columns} data={courses} />
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

export default CoursesPage;
