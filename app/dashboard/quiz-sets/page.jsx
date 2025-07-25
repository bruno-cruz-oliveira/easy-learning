import { getAllQuizSets } from "@/queries/quizzes";
import { columns } from "./_components/Columns";
import { DataTable } from "./_components/DataTable";

const QuizSets = async () => {
  const quzSetsAll = await getAllQuizSets();
  const mappedQuizSets = quzSetsAll.map(q => {
    return {
      id: q.id,
      title: q.title,
      isPublished: q.active,
      totalQuiz: q.quizIds.length,
    };
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={mappedQuizSets} />
    </div>
  );
};

export default QuizSets;
