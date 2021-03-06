import { BankAccountEvent, IBankAccount } from '../types'

enum AccountTypes {
  AccountOpened = 'AccountOpened',
  MoneyDebited = 'MoneyDebited',
  MoneyCredited = 'MoneyCredited',
  AccountUpdated = 'AccountUpdated',
}

/**
 * Creates a bank account with the list of events.
 * @param events
 * @returns a bank account
 */
export const accountReducer = (events: BankAccountEvent[]): IBankAccount =>
  events.reduce((acc, val) => {
    const { type } = val
    // initialize the default values
    acc['status'] = 'open'
    acc['accountId'] = val.accountId
    if (type === AccountTypes.AccountOpened) {
      acc['ownerName'] = val.ownerName
      acc['openedAt'] = Date.parse(val.time)
      acc['transactions'] = []
      acc['balance'] = 0
    }
    // initiate the lisf of transactions
    if (type === AccountTypes.MoneyDebited) {
      const transaction = {
        type: 'debit' as const,
        value: val.value,
        timestamp: Date.parse(val.time),
      }
      acc['balance'] -= val.value
      acc['transactions'].push(transaction)
    }
    if (type === AccountTypes.MoneyCredited) {
      const transaction = {
        type: 'credit' as const,
        value: val.value,
        timestamp: Date.parse(val.time),
      }
      acc['balance'] += val.value
      acc['transactions'].push(transaction)
    }
    // if the account owner's name has been updated
    if (type === AccountTypes.AccountUpdated) {
      acc['ownerName'] = val.ownerName
    }
    acc['isOverdrawn'] = acc['balance'] < 0
    return acc
  }, {} as IBankAccount)
