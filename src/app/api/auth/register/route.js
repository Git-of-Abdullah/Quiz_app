import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import User from '@/models/User'
import dbConnect from '@/lib/dbconnect'

export async function POST(req) {
  try {
    await dbConnect()

    const { name, email, password, role } = await req.json()

    // ✅ Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields (name, email, password) are required" },
        { status: 400 }
      )
    }

    
    const allowedRoles = ["student", "teacher", "admin"]
    const userRole = allowedRoles.includes(role) ? role : "student"

    
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    
    const hashedPassword = await bcrypt.hash(password, 10)

    
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    })

    await newUser.save()

    console.log(" A new User has been created:", newUser.email)

    return NextResponse.json(
      {
        message: "User Created Successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role, 
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error(" Error creating user:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
