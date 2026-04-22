import axios from 'axios'

export const postAuth = async (
  url: string,
  email: string,
  password: string,
) => {
  try {
    const res = await axios.post(url, {
      email,
      password,
    })
    console.table(res.data)
    return res.data
  } catch (e) {
    throw e
  }
}

export const loginApi = async (email: string, password: string) => {
  postAuth('http://localhost:3000/auth/login', email, password)
}

export const registerApi = async (email: string, password: string) => {
  postAuth('http://localhost:3000/auth/register', email, password)
}
