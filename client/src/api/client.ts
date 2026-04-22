import axios from 'axios'

export const loginApi = async (email: string, password: string) => {
  try {
    const res = await axios.post('http://localhost:3000/auth/login', {
      email,
      password,
    })
    console.table(res.data)
    return res.data
  } catch (e) {
    throw e
  }
}
