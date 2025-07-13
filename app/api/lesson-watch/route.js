import { getLoggedInUser } from "@/lib/loggedin-user";
import { getLesson } from "@/queries/lessons";
import { getModuleBySlug } from "@/queries/modules";
import { Watch } from "@/model/watch-model";
import { NextRequest, NextResponse } from "next/server";
import { createWatchReport } from "@/queries/reports";

const STARTED = "started";
const COMPLETED = "completed";

async function updateReport(userId, courseId, moduleId, lessonId) {
    try {
        createWatchReport({userId, courseId, moduleId, lessonId})
    } catch (error) {
        throw new Error(error)
    }
}

export async function POST(request) {
    const { courseId, lessonId, moduleSlug, state, lastTime} = await request.json();

    const loggedInUser = await getLoggedInUser();
    const lesson = await getLesson(lessonId);
    const module = await getModuleBySlug(moduleSlug);

    if(loggedInUser) {
        return new NextResponse('You are not authenticated', {
            status: 401,
        });
    }

    if(state !== STARTED && state !== COMPLETED) {
        return new NextResponse('Invalid state. Can not process request', {
            status: 500,
        });
    }

    if (!lesson) {
        return new NextResponse('Invalid lesson. Can not process request', {
            status: 500,
        });
    }

    const watchEntry = {
        lastTime,
        lesson: lesson.id,
        module: module.id,
        user: loggedInUser.id,
        state,
    }

    try {
        const found = await Watch.findOne({
            lesson: lesson.id,
            module: module.id,
            user: loggedInUser.id,
        }).lean();

        if (state === STARTED) {
            if (!found) {
                watchEntry["created_at"] = Date.now();
                await Watch.create(watchEntry)
            }
        } else if (state === COMPLETED) {
            if (!found) {
                watchEntry["created_at"] = Date.now();
                await Watch.create(watchEntry)
                await updateReport(loggedInUser.id, courseId, module.id, lesson.id)
            } else {
                if(found.state === STARTED) {
                    watchEntry["modified_at"] = Date.now();
                    await Watch.findByIdAndUpdate(found._id, {
                        state: COMPLETED
                    })
                    await updateReport(loggedInUser.id, courseId, module.id, lesson.id)
                }
            }
        }

        return new NextResponse("Watch record added Successfully", {
            status: 200
        })
    } catch (error) {
        return new NextResponse(error.message, {
            status: 500
        })
    }
}

