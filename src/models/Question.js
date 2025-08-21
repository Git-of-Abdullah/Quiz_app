import mongoose, { Schema, models } from "mongoose"

const questionSchema = new Schema(
  {
    statement: {
      type: String,
      required: true,
      trim: true,
    },
    options: [
      {
        type: Schema.Types.ObjectId,
        ref: "Option",
      },
    ],
  },
  { timestamps: true }
)

const Question = models.Question || mongoose.model("Question", questionSchema)
export default Question
