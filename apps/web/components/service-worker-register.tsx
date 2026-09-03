"use client"

import { useEffect } from "react"

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Skipped in development: a service worker intercepting requests fights
    // Turbopack's HMR connection.
    if (process.env.NODE_ENV !== "production") return
    if (!("serviceWorker" in navigator)) return

    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("[sw:register]", error)
    })
  }, [])

  return null
}
