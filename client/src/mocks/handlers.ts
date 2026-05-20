import { http } from 'msw'

export const handlers = [
  http.get('http://localhost:3000/categories', () => {
    return Response.json([
      {
        id: '1',
        name: 'Food',
        type: 'EXPENSE',
      },
    ])
  }),
]