"use client";
import { Button } from "@/components/ui/button";
import { ReviewModal } from "./ReviewModal";
import { useState } from "react";

export const GiveReview = ({courseId,loginid}) => {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setIsReviewModalOpen(true)}
                variant="outline"
                className="w-full mt-6"
            >
                Give Review
            </Button>
            <ReviewModal open={isReviewModalOpen} setOpen={setIsReviewModalOpen} courseId={courseId} loginid={loginid}/>
        </>
    );
};