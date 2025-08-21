import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbconnect"
import Quiz from "@/models/Quiz"
import Question from "@/models/Question"
import Option from "@/models/Option"
import { getServerSession } from "next-auth/next"
import mongoose from "mongoose"


export async function POST(req) {
  try {
    await dbConnect()
    const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ status: "fail", message: "Not authenticated" }, { status: 401 })
  }
    const quizData = await req.json()

    let questionIds = []

    
    for (const q of quizData.questions) {
      
      const newQuestion = new Question({
        statement: q.statement,
      })
      await newQuestion.save()

      
      let optionIds = []
      for (const opt of q.options) {
        const newOpt = new Option({
          ...opt,
          questionId: newQuestion._id,
        })
        await newOpt.save()
        optionIds.push(newOpt._id)
      }

      // Link options to question
      newQuestion.options = optionIds
      await newQuestion.save()

      questionIds.push(newQuestion._id)
    }

    // Create Quiz
    const newQuiz = new Quiz({
      title: quizData.title || "Untitled Quiz",
      createdBy: new mongoose.Types.ObjectId(session.user.id), 
      questions: questionIds,
      totalScore: quizData.totalScore,
      startTime: quizData.startTime,
      endTime: quizData.endTime,
    })

    await newQuiz.save()

    return NextResponse.json(
      { message: "Quiz created successfully", quiz: newQuiz },
      { status: 201 }
    )
  } catch (error) {
    console.error(" Failed to create quiz:", error)
    return NextResponse.json(
      { message: "Failed to create quiz", error: error.message },
      { status: 500 }
    )
  }
}




export async function GET() {
  try {
    await dbConnect()

    const quizData = await Quiz.find()
      .populate({
        path: "questions",
        select: "statement options",
        populate: {
          path: "options",
          select: "statement isCorrect"
        }
      })

    return NextResponse.json(
      { status: "success", quizData },
      { status: 200 }
    )
  } catch (error) {
    console.error("Failed to fetch quizzes:", error)
    return NextResponse.json(
      { status: "fail", message: error.message },
      { status: 500 }
    )
  }
}

