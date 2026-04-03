import express from 'express'
import { notFound } from './middlewares/notFound'
import { errorHandler } from './middlewares/errorHandler'
import debug from './routes/debug.routes'
import authRouter from './routes/auth.routes'
import meRouter from './routes/me.routes'
import categoriesRouter from './routes/categories.routes'
import transactionsRouter from './routes/transactions.routes'

const app = express()

app.use(express.json())
app.use(debug)
app.use('/auth', authRouter)
app.use('/me', meRouter)
app.use('/categories', categoriesRouter)
app.use('/transactions', transactionsRouter)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use(notFound)
app.use(errorHandler)

export default app
