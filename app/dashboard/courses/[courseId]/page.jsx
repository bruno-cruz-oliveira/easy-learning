import { IconBadge } from "@/components/dashboard/IconBadge";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { CategoryForm } from "./_components/CategoryForm";
import { DescriptionForm } from "./_components/DescriptionForm";
import { ImageForm } from "./_components/ImageForm";
import { ModulesForm } from "./_components/ModuleForm";
import { PriceForm } from "./_components/PriceForm";
import { TitleForm } from "./_components/TitleForm";
import { CourseAction } from "./_components/CourseAction";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { QuizSetForm } from "./_components/QuizSetForm";
import { SubTitleForm } from "./_components/SubTitleForm";
import { getCourseDetails } from "@/queries/courses";
import { getCategories } from "@/queries/categories";
import { replaceMongoIdInArray } from "@/lib/convertData";
import { ObjectId } from "mongoose";
import { getAllQuizSets } from "@/queries/quizzes";

const EditCourse = async ({ params }) => {
  const { courseId } = await params;

  const course = await getCourseDetails(courseId);
  const categories = await getCategories();

  const mappedCategories = categories.map(c => {
    return {
      value: c.title,
      label: c.title,
      id: c.id,
    };
  });

  // Sanitize function for handle ObjectID and Buffer
  function sanitizeData(data) {
    return JSON.parse(
      JSON.stringify(data, (key, value) => {
        if (value instanceof ObjectId) {
          return value.toString();
        }

        if (Buffer.isBuffer(value)) {
          return value.toString("base64");
        }
        return value;
      })
    );
  }

  const rawModules = await replaceMongoIdInArray(course?.modules).sort((a, b) => a.order - b.order);
  const modules = sanitizeData(rawModules);

  const allQuizSets = await getAllQuizSets(true);
  let mappedQuizSet = [];

  if (allQuizSets && allQuizSets.length > 0) {
    mappedQuizSet = allQuizSets.map(quizSet => {
      return {
        value: quizSet.id,
        label: quizSet.title,
      }
    })
  }

  return (
    <>
      {!course?.active && (
        <AlertBanner
          label="This course is unpublished. It will not be visible in the course."
          variant="warning"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-end">
          <CourseAction courseId={courseId} isActive={course?.active} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm
              initialData={{
                title: course?.title,
              }}
              courseId={courseId}
            />
            <SubTitleForm
              initialData={{
                subtitle: course?.subtitle,
              }}
              courseId={courseId}
            />
            <DescriptionForm initialData={{ description: course?.description }} courseId={courseId} />
            <ImageForm initialData={{ imageUrl: `/assets/images/courses/${course?.thumbnail}` }} courseId={courseId} />
            <CategoryForm initialData={{ value: course?.category?.title }} courseId={courseId} options={mappedCategories} />

            <QuizSetForm initialData={{ quizSetId: course?.quizSet?._id.toString() }} courseId={courseId} options={mappedQuizSet} />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2 mb-6">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Modules</h2>
              </div>

              <ModulesForm initialData={modules} courseId={courseId} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell you course</h2>
              </div>
              <PriceForm initialData={{ price: course?.price }} courseId={courseId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default EditCourse;
