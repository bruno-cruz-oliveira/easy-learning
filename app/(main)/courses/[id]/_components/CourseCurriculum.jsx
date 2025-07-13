import React from "react";
import { BookCheck } from "lucide-react";
import { Radio } from "lucide-react";
import { Clock10 } from "lucide-react";
import { CourseModuleList } from "./module/CourseModuleList";
import { Accordion } from "@/components/ui/accordion";

export const CourseCurriculum = ({ course }) => {
  const totalDuration = course?.modules.map(item => {
    return item.lessonIds.reduce(function (acc, obj) {
      return acc + obj.duration;
    }, 0)
  }).reduce(function(acc, obj) {
    return acc + obj;
  }, 0)

  return (
    <>
      <div className="flex gap-x-5 items-center justify-center flex-wrap mt-4 mb-6 text-gray-600 text-sm">
        <span className="flex items-center gap-1.5">
          <BookCheck className="w-4 h-4" />
          {course?.modules?.length} Chapters
        </span>
        <span className="flex items-center gap-1.5">
          <Clock10 className="w-4 h-4" />
          {(totalDuration/3660).toPrecision(2)}+ Hours
        </span>
        <span className="flex items-center gap-1.5">
          <Radio className="w-4 h-4" />4 Live Class
        </span>
      </div>

      <Accordion
        defaultValue={["item-1", "item-2", "item-3"]}
        type="multiple"
        collapsible="true"
        className="w-full"
      >
        {course?.modules && course.modules.map((module, i) => (
          <CourseModuleList key={module.id || i} module={module} />
        ))}
      </Accordion>
    </>
  );
};
