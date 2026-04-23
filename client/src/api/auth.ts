import { api } from './client'

export const postAuth = async (
  url: string,
  email: string,
  password: string,
) => {
  try {
    const res = await api.post(url, {
      email,
      password,
    })
    return res.data
  } catch (e) {
    throw e
  }
}

export const loginApi = async (email: string, password: string) => {
  return postAuth('/auth/login', email, password)
}

export const registerApi = async (email: string, password: string) => {
  return postAuth('/auth/register', email, password)
}
