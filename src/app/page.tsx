"use client"
import { useState, useRef } from "react"

type ReservationAnswer = {
  hotelName: string | null
  hotelAddress: string | null
  reservationDate: string | null
  reservationTime: string | null
  reservationForPersons: number | null
  action: "reserve" | "cancel" | "modify" | "unknown"
}

export default function Home() {
  const [userQuery, setUserQuery] = useState("")
  const [answers, setAnswers] = useState<ReservationAnswer[]>([])
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

      const reservation = data as ReservationAnswer
      setAnswers((prev) => [reservation, ...prev])

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

      <div className="w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-3">Answers</h2>

        {answers.length === 0 ? (
          <p>No answers yet. Ask a question below!</p>
        ) : (
          answers.map((ans, index) => (
            <div
              key={index}
              className="border p-4 rounded mb-3 shadow-sm bg-white"
            >
              <p>
                <strong>Action:</strong> {ans.action}
              </p>
              <p>
                <strong>Hotel Name:</strong> {ans.hotelName ?? "—"}
              </p>
              <p>
                <strong>Hotel Address:</strong> {ans.hotelAddress ?? "—"}
              </p>
              <p>
                <strong>Date:</strong> {ans.reservationDate ?? "—"}
              </p>
              <p>
                <strong>Time:</strong> {ans.reservationTime ?? "—"}
              </p>
              <p>
                <strong>Persons:</strong> {ans.reservationForPersons ?? "—"}
              </p>
            </div>
          ))
        )}
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-xl">
        <div className="flex gap-2">
          <input
            type="text"
            ref={inputRef}
            value={userQuery}
            name="userInput"
            id="userInput"
            placeholder="Type your query here..."
            onChange={(e) => setUserQuery(e.target.value)}
            disabled={loading}
            className="flex-1 border px-3 py-2 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>
      </form>
    </div>
  )
}
