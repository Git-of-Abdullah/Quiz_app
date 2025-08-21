"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" // default role
  })
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      })
    })

    if (res.ok) {
      router.push("/auth/login")
    } else {
      const data = await res.json()
      setError(data.error || "Something went wrong")
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
          required
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Role Select */}
        <select
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
        >
          Register
        </button>
      </form>

      <div className="flex items-center my-6">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-2 text-gray-500">OR</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => signIn("google")}
          className="bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold transition"
        >
          Sign in with Google
        </button>
        <button
          onClick={() => signIn("github")}
          className="bg-gray-800 hover:bg-gray-900 text-white py-2 rounded font-semibold transition"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  )
}
