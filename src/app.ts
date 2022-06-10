import express from 'express'
import { expressErrorHandler } from './lib/errorHandling'
import { loadEvents } from './lib/events'
import { IBankAccount } from './types'
import { accountReducer } from './lib/accountReducer'

export const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.contentType('text/html')
  res.send(`
    <style>
      html { font-family: sans-serif; }
      body { padding: 4rem; line-height: 1.5; }
    </style>

    <h1>Ticknovate test</h1>

    <p>Hello! Add your two routes to this app to complete the test.</p>
    
    <p>The boilerplate of the <a href="/accounts/12060626">first one</a> has been done for you, but you'll
    have to complete the implementation, and add the second route for
    changing an account owner's name. See the README for more information.</p>
    
    <p>Good luck!</p>
  `)
})

// TODO: Complete the implementation of this route!
app.get('/accounts/:id', async (req, res, next) => {
  try {
    // This `loadEvents` function currently just returns an empty array.
    // Take a look at the function and complete the implementation.
    const events = await loadEvents(req.params.id)
    const account: IBankAccount = accountReducer(events)
    res.json(account)
  } catch (err) {
    next(err)
  }
})

app.patch('/accounts/:id', async (req, res, next) => {})
app.use(expressErrorHandler)
