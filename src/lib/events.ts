import fs from 'fs/promises'
import path from 'path'
import { AppError } from './errorHandling'
import type { BankAccountEvent } from '../types'

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
  console.log(filePath)
  try {
    const files: string[] = await fs.readdir(filePath)
    const future: Promise<BankAccountEvent>[] = files.map(async (file) => {
      const fileBuffer: Buffer = await fs.readFile(`${filePath}/${file}`)
      const event: BankAccountEvent = JSON.parse(
        Buffer.from(fileBuffer).toString()
      )
      return event
    })
    return Promise.all(future)
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

export const updateEvent = async (
  events: BankAccountEvent[],
  accountId: string,
  ownerName: string
) => {
  const position = events[events.length - 1].position + 1
  const accountUpdatedEvent: BankAccountEvent = {
    accountId,
    type: 'AccountUpdated',
    ownerName: ownerName,
    time: new Date().toISOString(),
    position,
  }
  events.push(accountUpdatedEvent)
  await saveEvents(events)
}
