"use client"
import { useState, useRef } from "react"

type Answer = {
  summary: string
  confidence: number
}

export default function Home() {
  const [userQuery, setUserQuery] = useState("")
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const q = userQuery.trim()

    if (!q || loading) return
    setLoading(true)
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: q }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error("Request failed.")

      const { summary, confidence } = data as {
        summary: string
        confidence: number
      }
      setAnswers((prev) => [{ summary, confidence }, ...prev])
      setUserQuery("")
      inputRef.current?.focus()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-between w-full px-4 pb-24 pt-8 ">
      <header className="mb-4">
        <h1>Hello Ask Anything</h1>
      </header>

      <div>
        <div>
          <h2>Answers</h2>
        </div>
        <div>
          {answers.length === 0 ? (
            <p>No answers yet. Ask a question below!</p>
          ) : (
            answers.map((ans, index) => (
              <div key={index}>
                <h3>{ans.summary}</h3>
                <p>Confidence: {ans.confidence}</p>
              </div>
            ))
          )}
        </div>
      </div>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            ref={inputRef}
            value={userQuery}
            name="userInput"
            id="userInput"
            placeholder="Type your query here..."
            onChange={(e) => setUserQuery(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>
      </form>
    </div>
  )
}
