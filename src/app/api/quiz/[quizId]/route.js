import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbconnect"
import Quiz from "@/models/Quiz"
import Question from "@/models/Question"
import Option from "@/models/Option" 

export async function GET(req, { params }) {
  try {
    await dbConnect()

    const { quizId } = params

    // Find quiz by ID and populate questions and options
    const quizData = await Quiz.findById(quizId)
      .populate({
        path: "questions",
        select: "statement options",
        populate: {
          path: "options",
          select: "statement isCorrect"
        }
      })

    if (!quizData) {
      return NextResponse.json(
        { status: "fail", message: "Quiz not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { status: "success", quizData },
      { status: 200 }
    )
  } catch (error) {
    console.error("Failed to fetch quiz:", error)
    return NextResponse.json(
      { status: "fail", message: error.message },
      { status: 500 }
    )
  }
}



export async function PATCH(req, { params }) {
  try {
    await dbConnect()

    const { quizId } = params
    const quizData = await req.json()

    // 1️⃣ Fetch quiz with questions and options
    const quiz = await Quiz.findById(quizId).populate({
      path: "questions",
      populate: { path: "options" }
    })

    if (!quiz) {
      return NextResponse.json(
        { status: "fail", message: "Quiz not found" },
        { status: 404 }
      )
    }

    
    if (quizData.questions && quizData.questions.length === quiz.questions.length) {
      for (let i = 0; i < quiz.questions.length; i++) {
        const q = quiz.questions[i]
        const updatedQ = quizData.questions[i]

        
        await Question.findByIdAndUpdate(q._id, { statement: updatedQ.statement })

        
        if (updatedQ.options && updatedQ.options.length === q.options.length) {
          for (let j = 0; j < q.options.length; j++) {
            await Option.findByIdAndUpdate(q.options[j]._id, updatedQ.options[j])
          }
        }
      }
    }

    // 3️⃣ Update quiz fields
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      {
        title: quizData.title,
        totalScore: quizData.totalScore,
        startTime: quizData.startTime,
        endTime: quizData.endTime
      },
      { new: true }
    )

    return NextResponse.json(
      { status: "success", updatedQuiz },
      { status: 200 }
    )
  } catch (error) {
    console.error(" Failed to update quiz:", error)
    return NextResponse.json(
      { status: "fail", message: "Failed to update quiz", error: error.message },
      { status: 500 }
    )
  }
}



export async function DELETE(req, { params }) {
  try {
    await dbConnect()

    const { quizId } = params

    const quiz = await Quiz.findById(quizId)
    if (!quiz) {
      return NextResponse.json(
        { status: "fail", message: "Quiz not found" },
        { status: 404 }
      )
    }

    // 1️⃣ Delete all options of all questions
    for (const questionId of quiz.questions) {
      await Option.deleteMany({ questionId })
    }

    // 2️⃣ Delete all questions
    await Question.deleteMany({ _id: { $in: quiz.questions } })

    // 3️⃣ Delete quiz
    await Quiz.findByIdAndDelete(quizId)

    return NextResponse.json(
      { status: "success", message: "Quiz and all related questions/options deleted" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Failed to delete quiz:", error)
    return NextResponse.json(
      { status: "fail", message: "Failed to delete quiz", error: error.message },
      { status: 500 }
    )
  }
}
