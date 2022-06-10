import fs from 'fs/promises'
import path from 'path'
import type { BankAccountEvent } from '../types'
import { AppError } from './errorHandling'

/**
 * Load events for the given `accountId`.
 *
 * TODO: Implement this function. This is part of the test.
 *
 * The implementation should return a promise that resolves to an array
 * of objects, sourced from the relevant directory inside of the "events"
 * directory at the root of this project.
 *
 * @see saveEvents
 */
export async function loadEvents(
  accountId: string
): Promise<BankAccountEvent[]> {
  const filePath = path.join(process.cwd(), `/events/${accountId}`)
  try {
    const events: string[] = await fs.readdir(filePath)
    const futureEvents: Promise<BankAccountEvent>[] = events.map(
      async (event) => {
        const fileBuffer: Buffer = await fs.readFile(`${filePath}/${event}`)
        const parsedEvent: BankAccountEvent = JSON.parse(
          Buffer.from(fileBuffer).toString()
        )
        return parsedEvent
      }
    )
    return Promise.all(futureEvents)
  } catch (error) {
    throw new AppError(400, `Unable to read events for ${accountId}`)
  }
}

/**
 * Saves new events.
 */
export async function saveEvents(events: BankAccountEvent[]) {
  await Promise.all(
    events.map(async (event) => {
      const filepath = path.join(
        __dirname,
        '../../events',
        event.accountId,
        `${event.position}.json`
      )
      console.log('Writing new event to', filepath)
      await fs.writeFile(filepath, JSON.stringify(event, null, 2), {
        // Fail if the file already exists
        flag: 'wx',
      })
    })
  )
}
