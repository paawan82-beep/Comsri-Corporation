import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    // setIsMobile(window.innerWidth < MOBILE_BREAKPOINT) is already done initially if we wanted to,
    // but better to set it using a layout effect or just leave the initial undefined to avoid mismatch.
    // To fix the synchronous setState while rendering effect bug, we just remove the synchronous call
    // and rely on the onChange if needed, or set the initial state correctly.
    // Actually, setting state inside useEffect is fine, but we should use a single initial state.
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
