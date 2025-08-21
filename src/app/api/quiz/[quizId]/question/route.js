import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbconnect"
import Quiz from "@/models/Quiz"
import Question from "@/models/Question"
import Option from "@/models/Option"

export async function POST(req, { params }) {
  try {
    await dbConnect()

    const { quizId } = params
    const questionData = await req.json()

    
    const newQuestion = new Question({
      statement: questionData.statement,
    })
    await newQuestion.save()

    
    let optionIds = []
    for (const opt of questionData.options) {
      const newOpt = new Option({
        ...opt,
        questionId: newQuestion._id,
      })
      await newOpt.save()
      optionIds.push(newOpt._id)
    }

    
    newQuestion.options = optionIds
    await newQuestion.save()

    
    await Quiz.findByIdAndUpdate(
      quizId,
      { $push: { questions: newQuestion._id } },
      { new: true }
    )

    return NextResponse.json(
      { message: "Question added", question: newQuestion },
      { status: 201 }
    )
  } catch (error) {
    console.error(" Failed to add question:", error)
    return NextResponse.json(
      { message: "Failed to add question", error: error.message },
      { status: 500 }
    )
  }
}

