import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { stripe } from "@/lib/stripe";
import { getCourseDetails } from "@/queries/courses";
import { getUserByEmail } from "@/queries/users";
import { CircleCheck } from "lucide-react";
import { redirect } from "next/dist/server/api-utils";
import { sendEmails } from "@/lib/emails";
import { enrollForCourse } from "@/queries/enrollments";
import Link from "next/link";

const Success = async ({ searchParams }) => {

    const { session_id, courseId } = await searchParams;

    if (!session_id) {
        throw new Error("Please provide a valid session id that start with cs_");
    }

    const userSession = await auth();

    if (!userSession?.user?.email) {
        redirect("/login");
    }

    const course = await getCourseDetails(courseId);
    const loggedInUser = await getUserByEmail(userSession?.user?.email);

    const checkoutSession = await stripe.checkout.sessions.retrieve(
        session_id,
        {
            expand: ["line_items", "payment_intent"],
        }
    );

    const paymentIntent = checkoutSession?.payment_intent;
    const paymentStatus = paymentIntent?.status;

    // Customer info
    const customerName = `${loggedInUser?.firstName} ${loggedInUser?.lastName}`;
    const customerEmail = loggedInUser?.email;
    const productName = course?.title;

    if (paymentStatus == "succeeded") {
        // Update date to enrollment table
        const enrolled = await enrollForCourse(
            course?.id,
            loggedInUser?.id,
            "stripe"
        );

        // Send emails to the instructor and student who paid

        const instructorName = `${course?.instructor?.firstName} ${course?.instructor?.lastName}`;
        const instructorEmail = course?.instructor?.email;

        const emailsToSend = [
            {
                to: instructorEmail,
                subject: `New Enrollment For ${productName}`,
                message: `Congratulations, ${instructorName}. A new student, ${customerName}. A new student, ${customerName} just has enrolled to your course ${productName} just now.`
            },
            {
                to: customerEmail,
                subject: `Enrollment Success For ${productName}`,
                message: `Hey, ${customerName}. You have successfully enrolled for the course ${productName}.`
            },
        ];

        const emailSendResponse = await sendEmails(emailsToSend);
    }

    return (
        <div className="h-full w-full flex-1 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-6 max-w-[600px] text-center">

                {
                    paymentStatus == "succeeded" && (
                        <>
                            <CircleCheck className="w-32 h-32 bg-green-500 rounded-full p-0 text-white" />
                            <h1 className="text-xl md:text-2xl lg:text-3xl">
                                Congratulations! <strong>{customerName}</strong>  Your Enrollment was Successful for <strong>{productName}</strong>
                            </h1>
                        </>
                    )
                }
                <div className="flex items-center gap-3">
                    <Button asChild size="sm">
                        <Link href="/courses">Browse Courses</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/courses/${courseId}/lesson`}>Play Course</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Success;