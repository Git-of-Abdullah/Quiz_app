"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai"

export default function CreateQuizPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [quizTitle, setQuizTitle] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [totalScore, setTotalScore] = useState(0)
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    if (status === "loading") return
    if (!session) router.push("/auth/login")
    if (session && !["teacher", "admin"].includes(session.user.role))
      router.push("/auth/login")
  }, [session, status, router])

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { id: uuidv4(), statement: "", options: [] }
    ])
  }

  const deleteQuestion = id => {
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  const updateQuestionStatement = (id, value) => {
    setQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, statement: value } : q))
    )
  }

  const addOption = questionId => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? { ...q, options: [...q.options, { id: uuidv4(), statement: "", isCorrect: false }] }
          : q
      )
    )
  }

  const deleteOption = (questionId, optionId) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? { ...q, options: q.options.filter(o => o.id !== optionId) }
          : q
      )
    )
  }

  const updateOption = (questionId, optionId, key, value) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map(o => (o.id === optionId ? { ...o, [key]: value } : o))
            }
          : q
      )
    )
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // Check start & end time
    if (new Date(endTime) <= new Date(startTime)) {
      alert("End time must be after start time")
      return
    }

    const payload = {
      title: quizTitle,
      totalScore,
      startTime,
      endTime,
      createdBy: session.user.id,
      questions: questions.map(q => ({
        statement: q.statement,
        options: q.options.map(o => ({ statement: o.statement, isCorrect: o.isCorrect }))
      }))
    }

    const res = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      alert("Quiz Created!")
      router.push("/")
    } else {
      const data = await res.json()
      alert("Error: " + data.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-pink-50 flex justify-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-8 md:p-12">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
          Create New Quiz
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Quiz Info */}
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Quiz Title"
              value={quizTitle}
              onChange={e => setQuizTitle(e.target.value)}
              required
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm placeholder-gray-400"
            />
            <input
              type="number"
              placeholder="Total Score"
              value={totalScore}
              onChange={e => setTotalScore(e.target.value)}
              required
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="datetime-local"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              required
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm placeholder-gray-400"
            />
            <input
              type="datetime-local"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              required
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm placeholder-gray-400"
            />
          </div>

          {/* Questions */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600">Questions</h2>
            {questions.map((q, idx) => (
              <div key={q.id} className="border rounded-lg p-4 mb-4 bg-gray-50 relative shadow-sm">
                <input
                  type="text"
                  placeholder={`Question ${idx + 1}`}
                  value={q.statement}
                  onChange={e => updateQuestionStatement(q.id, e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => deleteQuestion(q.id)}
                  className="absolute top-7 right-5  text-red-500 hover:text-red-700"
                >
                  <AiOutlineDelete size={22} />
                </button>

                {/* Options */}
                <div className="ml-4 mt-3 flex flex-col gap-2">
                  {q.options.map((o, i) => (
                    <div key={o.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Option ${i + 1}`}
                        value={o.statement}
                        onChange={e => updateOption(q.id, o.id, "statement", e.target.value)}
                        className="border border-gray-300 p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-gray-500"
                      />
                      <label className="flex items-center gap-1 text-gray-700">
                        <input
                          type="checkbox"
                          checked={o.isCorrect}
                          onChange={e => updateOption(q.id, o.id, "isCorrect", e.target.checked)}
                          className="accent-pink-500"
                        />
                        Correct
                      </label>
                      <button
                        type="button"
                        onClick={() => deleteOption(q.id, o.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <AiOutlineDelete size={20} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(q.id)}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mt-2 font-medium"
                  >
                    <AiOutlinePlus /> Add Option
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold mt-2 transition"
            >
              <AiOutlinePlus /> Add Question
            </button>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-bold mt-6 hover:from-pink-500 hover:to-purple-600 transition"
          >
            Create Quiz
          </button>
        </form>
      </div>
    </div>
  )
}
