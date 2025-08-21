import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbconnect"
import Question from "@/models/Question"
import Option from "@/models/Option"


export async function POST(req, { params }) {
  try {
    await dbConnect()

    const { questionId } = params  
    const optionData = await req.json()

    
    const newOption = new Option({
      ...optionData,
      questionId,
    })
    await newOption.save()

    
    await Question.findByIdAndUpdate(
      questionId,
      { $push: { options: newOption._id } },
      { new: true }
    )

    return NextResponse.json(
      { message: "Option added", option: newOption },
      { status: 201 }
    )
  } catch (error) {
    console.error("Failed to add option:", error)
    return NextResponse.json(
      { message: "Failed to add option", error: error.message },
      { status: 500 }
    )
  }
}
