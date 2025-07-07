"use client"

import React, { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CanvasAnimation } from "@/components/canvas-animation"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function SignupPage() {
  const { status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  if (status === "loading" || status === "authenticated") {
    return <div className="flex min-h-svh flex-col items-center justify-center bg-black text-white">
      Loading...
    </div>
  }

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    const { name, email, password } = data

    if (!name || !email || !password) {
      setError("Please fill in all fields.")
      setIsLoading(false)
      return
    }
    try {
      const signupResponse = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!signupResponse.ok) {
        const res = await signupResponse.json()
        setError(res.message || "An error occurred during sign up.")
        setIsLoading(false)
        return
      }

      const signinResult = await signIn("credentials", {
        email: email as string,
        password: password as string,
        redirect: false,
      })

      if (signinResult?.error) {
        setError("Failed to sign in after creating account. Please try logging in.")
        console.error("Sign-in error after signup:", signinResult.error)
      } else if (signinResult?.ok) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Signup error: ", error)
      setError("An unexpected error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-black p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Card className="overflow-hidden bg-black border-white/80">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form onSubmit={handleSignupSubmit} className="p-6 md:p-8 bg-black" noValidate>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold text-white">Create an account</h1>
                  <p className="text-balance text-white/70">Sign up for your Inc account</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-white">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Elon Musk"
                    required
                    disabled={isLoading}
                    className="bg-white/90 text-black placeholder:text-black/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="spacex@example.com"
                    required
                    disabled={isLoading}
                    className="bg-white/90 text-black border-white placeholder:text-black/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="bg-white/90 text-black border-white placeholder:text-black/50"
                  />
                </div>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <Button type="submit" className="w-full bg-white/90 text-black hover:bg-white/80 hover:cursor-pointer" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-white">
                  <span className="relative z-10 bg-black px-2 text-white/70">Or continue with</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="w-full border-white hover:bg-white/90 hover:text-black bg-black text-white hover:cursor-pointer"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Continue with Google
                    <span className="sr-only">Sign up with Google</span>
                  </Button>
                </div>
                <div className="text-center text-sm text-white/70">
                  Already have an account?{" "}
                  <a href="/login" className="underline underline-offset-4 text-white hover:text-white/80">
                    Sign in
                  </a>
                </div>
              </div>
            </form>
            <div className="relative hidden bg-black md:block">
              <CanvasAnimation />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
