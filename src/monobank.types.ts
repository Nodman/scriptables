export type AccountT = {
  balance: number,
  cashbackType: string,
  creditLimit: number,
  currencyCode: number,
  iban: string,
  id: string,
  maskedPan: string[],
  sendId: string,
  type: string,
}

export type PersonalInfoT = {
  accounts: AccountT[],
  clientId: string,
  name: string,
  permissions: string,
  webHookUrl: string,
}

export type AccountsMapT = Record<string, {id: string, name: string, type: string}>

export type StatementItemT = {
  id: string,
  time: number,
  description: string,
  mcc: number,
  hold: boolean,
  amount: number,
  operationAmount: number,
  currencyCode: number,
  commissionRate: number,
  cashbackAmount: number,
  balance: number,
  comment: string,
  receiptId: string,
  counterEdrpou: string,
  counterIban: string,
}

export type StatementItemShortT = Pick<StatementItemT, 'id' | 'time' | 'mcc' | 'amount' | 'description' | 'cashbackAmount'> & {originalAmount?: number}

export type StatementCacheT = {
  history: Record<string, Record<string, number>>,
  currentPeriod: {
    total: number,
    month: number,
    year: number,
    statement: ((StatementItemShortT | null)[] | null)[],
    lastUpdatedAt: number,
    lastOperationId: string,
  },
}

export type SettingsT = Record<string, {accountId: string, filter?: string}>
