import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbconnect"
import Question from "@/models/Question"
import Option from "@/models/Option"
import Quiz from "@/models/Quiz"

export async function DELETE(req, { params }) {
  try {
    await dbConnect()

    const { questionId } = params

    
    await Option.deleteMany({ questionId })

    
    await Question.findByIdAndDelete(questionId)

    
    await Quiz.updateMany({}, { $pull: { questions: questionId } })

    return NextResponse.json(
      { message: "Question and its options deleted" },
      { status: 200 }
    )
  } catch (error) {
    console.error(" Failed to delete question:", error)
    return NextResponse.json(
      { message: "Failed to delete question", error: error.message },
      { status: 500 }
    )
  }
}


export async function PATCH(req, { params }) {
  try {
    await dbConnect()

    const { questionId } = params
    const quesData = await req.json()

    // 1️⃣ Check if question exists
    const question = await Question.findById(questionId).populate("options")
    if (!question) {
      return NextResponse.json(
        { status: "Failed", message: "Question doesn't exist" },
        { status: 404 }
      )
    }

    // 2️⃣ Update each option
    if (quesData.options && quesData.options.length === question.options.length) {
      for (let i = 0; i < question.options.length; i++) {
        await Option.findByIdAndUpdate(question.options[i]._id, quesData.options[i])
      }
    }

    // 3️⃣ Update question statement
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { statement: quesData.statement },
      { new: true }
    )

    return NextResponse.json(
      { status: "success", updatedQuestion },
      { status: 200 }
    )
  } catch (error) {
    console.error("Failed to update question:", error)
    return NextResponse.json(
      { status: "failed", message: "Failed to update question" },
      { status: 500 }
    )
  }
}


export async function GET(req, { params }) {
  try {
    await dbConnect()

    const { questionId } = params

    const question = await Question.findById(questionId).populate(
      "options",
      "statement isCorrect"
    )

    if (!question) {
      return NextResponse.json(
        { status: "fail", message: "Question not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { status: "success", question },
      { status: 200 }
    )
  } catch (error) {
    console.error("Failed to fetch question:", error)
    return NextResponse.json(
      { status: "fail", message: "Failed to fetch question", error: error.message },
      { status: 500 }
    )
  }
}
