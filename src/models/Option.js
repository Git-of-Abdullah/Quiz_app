import mongoose, { Schema, models } from "mongoose"

const optionSchema = new Schema(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    statement: {
      type: String,
      required: true,
      trim: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

// Prevent model overwrite on hot reload
const Option = models.Option || mongoose.model("Option", optionSchema)
export default Option
