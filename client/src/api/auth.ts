import { api } from './client'

export const postAuth = async (
  url: string,
  email: string,
  password: string,
) => {
  console.log(import.meta.env.VITE_API_URL)
  const res = await api.post(url, {
    email,
    password,
  })
  return res.data
}

export const loginApi = async (email: string, password: string) => {
  return postAuth('/auth/login', email, password)
}

export const registerApi = async (email: string, password: string) => {
  return postAuth('/auth/register', email, password)
}
