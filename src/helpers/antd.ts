export const execOnAntdEvent = (callback: () => void) => (e: any) => {
  callback()
  e.stopPropagation()
  e.preventDefault()
}
