"use client"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Component() {
  const { data: session, status } = useSession()
  const router = useRouter()
  console.log(session?.user)

  useEffect(() => {
    if (status === "loading") return 

    if (session) {
      router.push("/") 
    } else {
      router.push("/auth/login") 
    }
  }, [session, status, router])

  if (status === "loading") return <p>Loading...</p>

  if (session) {
    return (
      <>
        Signed in as {session.user?.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }

  return null
}
