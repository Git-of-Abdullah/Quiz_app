import mongoose, { Schema, models } from "mongoose"

const quizSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // quiz creator (teacher/admin)
      required: true,
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    totalScore: {
      type: Number,
      default: 0,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    submissions: [
      {
        student: { type: Schema.Types.ObjectId, ref: "User" },
        score: Number,
        submittedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
)

const Quiz = models.Quiz || mongoose.model("Quiz", quizSchema)
export default Quiz
