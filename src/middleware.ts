// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtDecode, type JwtPayload } from "jwt-decode"
import { AVAILABLE_RESOURCES } from "@/lib/constants"

interface DecodedToken extends JwtPayload {
  user_id: string
  email: string
  role: {
    name: string
    permissions: Array<{
      resource: string
      actions: string[]
    }>
  }
}

// Generate Protected Paths dynamically from AVAILABLE_RESOURCES
const RESOURCE_CONFIG = Object.entries(AVAILABLE_RESOURCES).reduce((acc, [resource, config]) => {
  acc[config.path] = { resource, action: 'read' }
  return acc
}, {} as Record<string, { resource: string, action: string }>)

const PROTECTED_PATHS = Object.keys(RESOURCE_CONFIG)

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  console.log("[Middleware] Request Path:", path)

  // Allow access to public routes
  const PUBLIC_ROUTES = ['/', '/register', '/forgot-password']
  if (PUBLIC_ROUTES.includes(path)) {
    return NextResponse.next()
  }

  // Allow access to debug page
  if (path === "/debug") {
    return NextResponse.next()
  }

  // Get auth token
  const token = request.cookies.get("authToken")?.value
  if (!token) {
    console.log("[Middleware] No authToken found")
    return NextResponse.redirect(new URL("/", request.url))
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token)

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000)
    if (decoded.exp && decoded.exp < currentTime) {
      console.log("[Middleware] Token expired")
      const response = NextResponse.redirect(new URL("/", request.url))
      response.cookies.delete("authToken")
      return response
    }

    // Super admin has access to all routes
    if (decoded.role.name === "super_admin") {
      return NextResponse.next()
    }

    // Special handling for dashboard
    if (path === "/dashboard") {
      const hasAnyPermission = decoded.role.permissions.length > 0
      if (hasAnyPermission) {
        return NextResponse.next()
      } else {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }

    // Check if path needs to be protected
    const isProtectedPath = PROTECTED_PATHS.some((prefix) => path.startsWith(prefix))
    if (!isProtectedPath) {
      return NextResponse.next()
    }

    // Find required permission for the current path
    const matchingPath = PROTECTED_PATHS.find((p) => path.startsWith(p))
    if (!matchingPath) {
      return NextResponse.next()
    }

    const requiredPermission = RESOURCE_CONFIG[matchingPath]

    // Determine the actual resource from the path
    const actualResource = Object.entries(AVAILABLE_RESOURCES).find(
      ([, config]) => path.endsWith(config.path)
    )?.[0]

    console.log("[Middleware] Checking Permissions:")
    console.log("- Current Path:", path)
    console.log("- User Role:", decoded.role.name)
    console.log("- Actual Resource:", actualResource)
    console.log("- Required Action:", requiredPermission.action)
    console.log("- User Permissions:", JSON.stringify(decoded.role.permissions))

    if (!actualResource) {
      console.log("[Middleware] No matching resource found for path")
      return NextResponse.redirect(new URL("/dashboard?error=invalid_resource", request.url))
    }

    // Check permissions
    const hasPermission = decoded.role.permissions.some((perm) => {
      return perm.resource === actualResource && perm.actions.includes(requiredPermission.action)
    })

    console.log("- Has Permission:", hasPermission)

    if (!hasPermission) {
      console.log("[Middleware] Access Denied")
      return NextResponse.redirect(
        new URL("/dashboard?error=no_access", request.url)
      )
    }

    return NextResponse.next()
  } catch (error) {
    console.error("[Middleware] Error:", error)
    const response = NextResponse.redirect(new URL("/", request.url))
    response.cookies.delete("authToken")
    return response
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
