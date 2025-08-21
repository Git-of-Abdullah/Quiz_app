"use client"
import React from 'react'
import { useSession } from "next-auth/react";


export default function Dashboard() {
    const { data: session } = useSession();
  return (
    <>
    <h1>Congratulations on successfull login</h1>
    <h1>{`Welcome : ${session.user.name}`}</h1>
    </>
  )
}
