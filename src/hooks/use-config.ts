import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export type Config = {
  lang: "en" | "hi" | "mr" | string
  style: string
  font: string
  mode: string
  layout: string
  theme: string
  radius: number
}

export type User = {
  name: string
  email: string
  college: string
  collegeId: number
}

const configAtom = atomWithStorage<Config>("config", {
  lang:"en",
  style: "default",
  font: "font-inter",
  theme: "slate",
  mode: "system",
  layout: "sidebar",
  radius: 0.5,
})

const userAtom = atomWithStorage<User>("user", {
  name: "",
  email: "",
  college: "",
  collegeId: 0
})

export function useConfig() {
  return useAtom(configAtom)
}

export function userConfig() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useAtom(userAtom)
}