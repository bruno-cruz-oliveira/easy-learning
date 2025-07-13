import { IconBadge } from "@/components/dashboard/IconBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LayoutDashboard } from "lucide-react";
import { Eye } from "lucide-react";
import { Video } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LessonTitleForm } from "./LessonTitleForm";
import { LessonDescriptionForm } from "./LessonDescriptionForm";
import { LessonAccessForm } from "./LessonAccessForm";
import { VideoUrlForm } from "./VideoUrlForm";
import { CourseActions } from "../../../_components/CourseAction";
import { LessonActions } from "../../../_components/LessonAction";

export const LessonModal = ({ open, setOpen, courseId, lesson, moduleId }) => {

  function postDelete() {
    setOpen(false);
    onclose();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent
        className="sm:max-w-[1200px] w-[96%] overflow-y-auto max-h-[90vh]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Lesson Editor</DialogTitle>
          <DialogDescription>
            Customize and manage the settings for this lesson.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex items-center justify-between">
            <div className="w-full">
              <Link
                href={`/dashboard/courses/${courseId}`}
                className="flex items-center text-sm hover:opacity-75 transition mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to course setup
              </Link>
              <div className="flex items-center justify-end">
                <LessonActions lesson={lesson} moduleId={moduleId} onDelete={postDelete} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={LayoutDashboard} />
                  <h2 className="text-xl">Customize Your chapter</h2>
                </div>
                <LessonTitleForm
                  initialData={{ title: lesson?.title }}
                  courseId={courseId}
                  lessonId={lesson?.id}
                />
                <LessonDescriptionForm
                  initialData={{description: lesson?.description}}
                  courseId={courseId}
                  lessonId={lesson?.id}
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={Eye} />
                  <h2 className="text-xl">Access Settings</h2>
                </div>
                <LessonAccessForm
                  initialData={{ifFree: lesson?.access !== 'private'}}
                  courseId={courseId}
                  lessonId={lesson?.id}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Video} />
                <h2 className="text-xl">Add a video</h2>
              </div>
              <VideoUrlForm
                initialData={{
                  url: lesson?.video_url,
                  duration: lesson?.duration
                }}
                courseId={courseId}
                lessonId={lesson?.id}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
