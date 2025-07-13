import { replaceMongoIdInObject } from "@/lib/convertData";
import { Assessment } from "@/model/assessment-model";
import { Module } from "@/model/module-model";
import { Report } from "@/model/report-model";
import mongoose from "mongoose";
import { getCourseDetails } from "./courses";


export async function getReport(filter) {
    try {
        const report = await Report.findOne(filter)
            .populate({
                path: "quizAssessment",
                model: Assessment,
            }).lean();
        return replaceMongoIdInObject(report);
    } catch (error) {
        throw new Error(error);
    }
}

export async function createWatchReport(data) {
    try {
        let report = await Report.findOne({
            course: data.courseId,
            student: data.userId,
        });

        if (!report) {
            report = await Report.create({
                course: data.courseId,
                student: data.userId,
            });
        }

        const fundLesson = report.totalCompletedLessons.find(lessonId => {
            lessonId.toString() === data.lessonId;
        });

        if (!fundLesson) {
            report.totalCompletedLessons.push(
                new mongoose.Types.ObjectId(data.lessonId)
            );
        }

        const module = await Module.findById(data.moduleId);
        const lessonIdsToCheck = module.lessonIds;
        const completedLessonsIds = report.totalCompletedLessons;

        const isModuleComplete = lessonIdsToCheck.every(lesson => {
            completedLessonsIds.includes(lesson);
        });

        if (isModuleComplete) {
            const foundModule = report.totalCompletedModules.find(module => {
                module.toString() === data.moduleId;
            });

            if (!foundModule) {
                report.totalCompletedModules.push(
                    new mongoose.Types.ObjectId(data.moduleId)
                );
            }
        }

        // Check if the course has completed

        const course = await getCourseDetails(data.courseId);
        const modulesInCourse = course?.modules;
        const moduleCount = modulesInCourse?.length ?? 0;

        const completedModule = report.totalCompletedModules;
        const completedModuleCount = completedModule?.length ?? 0;

        if (completedModuleCount >= 1 && completedModuleCount === moduleCount) {
            report.completion_date = Date.now();
        }
        report.save();
    } catch (error) {
        throw new Error(error);
    }
}

export async function createAssessmentReport(data) {
    try {
        let report = await Report.findOne({ course: data.courseId, student: data.userId });

        if (!report) {
            report = await Report.create({ course: data.courseId, student: data.userId, quizAssessment: data.quizAssessment });
        } else {
            if (!report.quizAssessment) {
                report.quizAssessment = data.quizAssessment;
                report.save();
            }
        }

    } catch (error) {
        throw new Error(error);
    }
}