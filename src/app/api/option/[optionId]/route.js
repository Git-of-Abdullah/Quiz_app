import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbconnect"
import Option from "@/models/Option"
import Question from "@/models/Question"

export async function DELETE(req, { params }) {
  try {
    await dbConnect()

    const { optionId } = params

    
    const option = await Option.findById(optionId)
    if (!option) {
      return NextResponse.json(
        { message: "Option not found" },
        { status: 404 }
      )
    }

    
    await Question.findByIdAndUpdate(option.questionId, {
      $pull: { options: optionId },
    })

    
    await Option.findByIdAndDelete(optionId)

    return NextResponse.json(
      { message: "Option deleted" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Failed to delete option:", error)
    return NextResponse.json(
      { message: "Failed to delete option", error: error.message },
      { status: 500 }
    )
  }
}


export async function PATCH(req, { params }) {
  try {
    await dbConnect()

    const { optionId } = params
    const optData = await req.json()

    
    const option = await Option.findById(optionId)
    if (!option) {
      return NextResponse.json(
        { status: "Failed", message: "Option doesn't exist" },
        { status: 404 }
      )
    }

    
    const updatedOption = await Option.findByIdAndUpdate(optionId, optData, {
      new: true,
    })

    return NextResponse.json(
      { status: "success", updatedOption },
      { status: 200 }
    )
  } catch (error) {
    console.error(" Failed to update option:", error)
    return NextResponse.json(
      { status: "failed", message: "Failed to update option" },
      { status: 500 }
    )
  }
}


export async function GET(req, { params }) {
  try {
    await dbConnect()

    const { optionId } = params

    // Find option by ID
    const option = await Option.findById(optionId)
    if (!option) {
      return NextResponse.json(
        { status: "fail", message: "Option not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { status: "success", data: option },
      { status: 200 }
    )
  } catch (error) {
    console.error("Failed to get option:", error)
    return NextResponse.json(
      { status: "fail", message: "Failed to get option", error: error.message },
      { status: 500 }
    )
  }
}
