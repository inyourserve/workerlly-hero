import { cookies } from "next/headers"
import { jwtDecode } from "jwt-decode"

export default async function DebugPage() {
  const cookieStore = cookies()
  const token = (await cookieStore).get("authToken")

  let decodedToken = null
  let error = null

  if (!token) {
    error = "No authToken found in cookies"
  } else {
    try {
      decodedToken = jwtDecode(token.value)
    } catch (e) {
      error = "Invalid token"
      console.error("Error decoding token:", e)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Debug Permissions</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto">{JSON.stringify(decodedToken, null, 2)}</pre>
      )}
    </div>
  )
}

