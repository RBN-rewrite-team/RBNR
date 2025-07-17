export default [{
  id: "a1",
  text: "bxbxbx"
}] as {
  id: string
  text: string
  unlocked?: boolean
  dynamic?: boolean
  reset?: () => void
  onClick?: () => string | undefined
}[]