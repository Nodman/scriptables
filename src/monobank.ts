/*
 * Variables used by Scriptable.
 * These must be at the very top of the file. Do not edit.
 * icon-color: deep-gray; icon-glyph: university;
 */

/*
 * author: https://github.com/Nodman
 * Monobank api module
 */

// NOTE: This script uses the Cache script (https://github.com/yaylinda/scriptable/blob/main/Cache.js)

import { fetchJson, createAlert, getDaysInMonth, Logger } from './utils'

const Cache = importModule('cache')

import type { PersonalInfoT, StatementItemT, StatementCacheT, SettingsT } from './monobank.types'

const DEFAULT_PERIOD = 12
const ACCOUNT_MASK_LEN = 4
const SCRIPT_NAME = 'monobank'
const CACHE_KEY_SETTINGS = 'settings.json'
const MONOBANK_TOKEN_KEY = 'monobank_token@scriptable'
const MONOBANK_API_URL = 'https://api.monobank.ua'
const API_PATH = {
  PERSONAL_INFO: '/personal/client-info',
  STATEMENT: '/personal/statement',
  CURRENCIES: '/bank/currency',
}
const CURRENCIES: Record<number, {id: number, sign: string, name: string}> = {
  978: { id: 978, name: 'EUR', sign: '€' },
  980: { id: 980, name: 'UAH', sign: '₴' },
  840: { id: 840, name: 'USD', sign: '$' },
}

const cache = new Cache(SCRIPT_NAME)
const logger = new Logger('Mono')

export class Monobank {
  private parentScriptName?: string
  private settings: Promise<SettingsT | void>

  constructor(parentScriptName?: string) {
    this.parentScriptName = parentScriptName
    this.readSettings()
  }

  static getTodaysExpanses({ currentPeriod }: { currentPeriod: StatementCacheT['currentPeriod'] }) {
    if (!currentPeriod || !currentPeriod.statement) {
      return 0
    }

    const date = (new Date()).getDate()
    const todaysStatement = currentPeriod.statement[date]

    if (!todaysStatement || !todaysStatement.length) {
      return 0
    }

    return todaysStatement.reduce((acc, item) => {
      return acc - (item?.amount ?? 0)
    }, 0)
  }

  static getStatsForPeriod({ history }: { history: StatementCacheT['history'] }, period: number = DEFAULT_PERIOD) {
    const yeatsAvailable = Object.keys(history).map(Number).sort((a, b) => a - b)
    const monthlyHistory: number[] = []
    const dailyHistory: number[] = []

    while (monthlyHistory.length < period && yeatsAvailable.length) {
      const [year] = yeatsAvailable.splice(-1)

      const yearPeriod = history[year] ?? {}

      Object
      .keys(yearPeriod)
      .map(Number)
      .sort((a, b) => b - a)
      .slice(-period + monthlyHistory.length)
      .forEach((month) => {
        const daysInMonth = getDaysInMonth(year, month)
        const monthValue = yearPeriod[month]

        monthlyHistory.unshift(monthValue)
        dailyHistory.unshift(monthValue / daysInMonth)
      })
    }

    return {
      monthlyHistory,
      dailyHistory,
      monthly: monthlyHistory.reduce(( acc, item ) => acc + item, 0) / (monthlyHistory.length || 1),
      daily: dailyHistory.reduce(( acc, item ) => acc + item, 0) / (dailyHistory.length || 1),
    }
  }

  private async getStatementItemsFilter() {
    const settings = await this.settings
    const filter = this.parentScriptName && settings ? settings[this.parentScriptName]?.filter : undefined

    return (statementItem: StatementItemT) => {
      const isExpanse = statementItem.amount < 0 || statementItem.description.toLowerCase().startsWith('скасування')
      const isExcluded = filter ? filter.split(';').some(filterString => statementItem.description.match(filterString)) : false

      return isExpanse && !isExcluded
    }
  }

  async readSettings() {
    this.settings = cache.read(CACHE_KEY_SETTINGS) ?? {}

    return await this.settings
  }

  private async writeSettings(nextSettings: SettingsT) {
    const prevSettings = await this.readSettings()
    const settings = { ...prevSettings, ...nextSettings }

    cache.write(CACHE_KEY_SETTINGS, settings)

    this.settings = Promise.resolve(settings)
  }

  private get requestHeaders(): Record<string, string> {
    const token = Keychain.get(MONOBANK_TOKEN_KEY)

    if (!token) {
      throw new Error('No token was found in keychain')
    }

    return {
      'X-Token': token,
    }
  }

  private async getAccountId(parentScriptName?: string) {
    const parentScript = parentScriptName ?? this.parentScriptName
    const settings = await this.settings
    let accountId = parentScript && settings ? settings[parentScript]?.accountId : undefined

    if (!accountId) {
      accountId = await this.setupAccount()
    }

    if (!accountId) {
      throw new Error('Account ID is required')
    }

    return accountId
  }

  private fetchData<R>(path: string): Promise<R> {
    if (this.isTokenProvided()) {
      const url = `${MONOBANK_API_URL}${path}`

      return fetchJson<R>(url, this.requestHeaders)
    }

    throw new Error('No token provided')
  }

  private isTokenProvided(): boolean {
    return Keychain.contains(MONOBANK_TOKEN_KEY)
  }

  private async getAccountCacheKey(parentScriptName?: string) {
    const accountId = await this.getAccountId(parentScriptName)

    return `mono-${accountId}.json`
  }

  async setupToken() {
    if (this.isTokenProvided()) {
      const tokenExistsAlert = createAlert('Monobank api token', 'Token already exists in your Keychain. Do you wish to change it?', 'Cancel')

      tokenExistsAlert.addAction('Change token')
      tokenExistsAlert.addDestructiveAction('Delete token')

      const actionIndex = await tokenExistsAlert.presentSheet()

      switch (actionIndex) {
        case -1:
          return
        case 1:
          return Keychain.remove(MONOBANK_TOKEN_KEY)
      }
    }

    const setupAlert = createAlert(
      'Monobank API token is required',
      `In order to fetch data from Monobank you need to provide your generated API token.
If you don't have one - please visit https://api.monobank.ua and follow the instructions.`,
      'Cancel')

    setupAlert.addAction('I have token')
    setupAlert.addAction('https://api.monobank.ua')

    const setupActionIndex = await setupAlert.presentSheet()

    switch (setupActionIndex) {
      case 0: {
        const inputAlert = createAlert('Insert token', 'Your token will be saved in Keychain', 'Cancel')

        inputAlert.addAction('Save')
        inputAlert.addSecureTextField('token:')

        const inputActionIndex = await inputAlert.present()
        const tokenValue = inputAlert.textFieldValue(0)

        if (inputActionIndex === -1) {
          break
        }

        if (tokenValue) {
          Keychain.set(MONOBANK_TOKEN_KEY, tokenValue)
          createAlert('Token saved', '', 'Ok').present()
        } else {
          createAlert('Invalid token value', '', 'Ok').present()
        }
        break
      }
      case 1:
        Safari.openInApp('https://api.monobank.ua')
        break
    }
  }

  async setupFilters(parentScriptName?: string) {
    const scriptName = parentScriptName ?? this.parentScriptName

    if (!scriptName) {
      return
    }

    const settings = await this.settings ?? {}
    const setupFiltersAlert = createAlert(
      'Set statement items filter',
      'Enter semicolon separated values, e.g. "rent;netflix;spotify". Items with one of those words in description will be excluded from accounting',
      'Cancel',
    )

    setupFiltersAlert.addAction('Save')

    const filter = settings ? settings[scriptName]?.filter : undefined

    setupFiltersAlert.addTextField('filter:', filter ?? '')

    const actionIndex = await setupFiltersAlert.present()

    if (actionIndex === -1) {
      return
    }

    const nextFilter = setupFiltersAlert.textFieldValue(0)

    settings[scriptName] = settings[scriptName] ?? {}
    settings[scriptName].filter = nextFilter

    await this.writeSettings(settings)


    createAlert('Filters saved', '', 'Ok').present()
  }

  async setupAccount(parentScriptName?: string) {
    const scriptName = parentScriptName ?? this.parentScriptName

    const setupAccountsAlert = createAlert(
      'Select account',
      'ID of selected account will be copied to clipboard and used for this script.',
      'Cancel',
    )

    const accounts = await this.fetchAccounts()

    accounts.forEach((item) => {
      const { name, type } = item

      setupAccountsAlert.addAction(`[${type}] ****${name}`)
    })

    const actionIndex = await setupAccountsAlert.presentSheet()

    if (actionIndex === -1) {
      return
    }

    const id = accounts[actionIndex].id

    Pasteboard.copy(id)

    if (scriptName) {
      await this.writeSettings({ [scriptName]: { accountId: id } })
    }

    return id
  }

  async fetchAccounts() {
    const response: PersonalInfoT = await this.fetchData<PersonalInfoT>(API_PATH.PERSONAL_INFO)

    const accounts = response.accounts.map((item) => {
      const name = (item.maskedPan[0] ?? item.iban).slice(-ACCOUNT_MASK_LEN)

      return {
        id: item.id,
        type: item.type,
        name,
      }
    })

    return accounts
  }

  async fetchAccountStatement(fromArg: Date, toArg?: Date): Promise<StatementItemT[]> {
    const from = Math.round(Number(fromArg) / 1e3)
    const to = Math.round(Number(toArg ?? new Date()) / 1e3)
    const accountId = await this.getAccountId()

    const url = `${API_PATH.STATEMENT}/${accountId}/${from}/${to}`

    return this.fetchData(url)
  }

  fetchTodaysStatement() {
    const to = new Date()
    const from = new Date()

    from.setHours(0, 0, 0, 0)

    return this.fetchAccountStatement(from, to)
  }

  async fetchLatestStatement(): Promise<StatementCacheT> {
    const accountCacheKey = await this.getAccountCacheKey()
    const { currentPeriod, history = {} }: StatementCacheT = await cache.read(accountCacheKey) ?? {}

    if (!currentPeriod?.lastUpdatedAt) {
      return this.fetchInitialPeriod()
    }

    const { lastUpdatedAt, lastOperationId } = currentPeriod
    const to = new Date()

    const response = await this.fetchAccountStatement(new Date(lastUpdatedAt), to)

    if (!response.length || (response[0].id === lastOperationId)) {
      logger.log('nothing to process, skipping...')

      return { currentPeriod, history }
    }

    const filter = await this.getStatementItemsFilter()

    for (let index = response.length - 1; index >= 0; index--) {
      const item = response[index]

      if (filter(item)) {
        const { id, time, amount, description, mcc, cashbackAmount } = item
        const opDate = new Date(item.time * 1e3)
        const month = opDate.getMonth() + 1
        const year = opDate.getFullYear()
        const date = opDate.getDate()

        if (month > currentPeriod.month) {
          history[currentPeriod.year] = history[currentPeriod.year] ?? {}
          history[currentPeriod.year][currentPeriod.month] = currentPeriod.total
          currentPeriod.year = year
          currentPeriod.month = month
          currentPeriod.total = 0
          currentPeriod.statement = [null]
        } else if (month < currentPeriod.month) {
          continue
        }

        currentPeriod.statement[date] = currentPeriod.statement[date] ?? []

        // @ts-ignore
        currentPeriod.statement[date].push({ id, time, amount, description, mcc, cashbackAmount })
        currentPeriod.total = currentPeriod.total += -1 * amount
      }
    }

    currentPeriod.lastUpdatedAt = Number(to)
    currentPeriod.lastOperationId = response[0].id

    cache.write(accountCacheKey, { currentPeriod, history })

    return { currentPeriod, history }
  }

  async fetchInitialPeriod() {
    logger.log('fetching initial period...')

    const to = new Date()
    const from = new Date()
    const currentMonth = from.getMonth() + 1
    const currentYear = from.getFullYear()

    from.setDate(1)
    from.setHours(0, 0, 0, 0)

    const response = await this.fetchAccountStatement(from, to)
    const filter = await this.getStatementItemsFilter()

    const currentPeriod = response.reduce((acc, item, index) => {
      if (filter(item)) {
        const { id, time, amount, description, mcc, cashbackAmount } = item
        const date = new Date(item.time * 1e3).getDate()
        const currentValue = acc.statement[date] ?? []

        acc.statement[date] = [{ id, time, amount, description, mcc, cashbackAmount }, ...currentValue]
        acc.total += -1 * amount

        if (!index) {
          acc.lastOperationId = id
        }
      }

      return acc
    }, { month: currentMonth, year: currentYear, total: 0, statement: [], lastOperationId: '', lastUpdatedAt: Number(to) } as StatementCacheT['currentPeriod'])

    const statement: StatementCacheT = {
      history: {},
      currentPeriod,
    }

    const accountCacheKey = await this.getAccountCacheKey()

    await cache.write(accountCacheKey, statement)

    return statement
  }

  async editOP({ date, day, amount: editAmount }: {date: number, day: number, amount: number | null}, parentScriptName?: string) {
    const accountCacheKey = await this.getAccountCacheKey(parentScriptName)
    const statement: StatementCacheT = await cache.read(accountCacheKey)
    const item = statement.currentPeriod.statement?.[date]?.[day]

    if (item == null) {
      throw new Error(`OP not found: ${date}-${day}`)
    }

    if (editAmount === null) {
      item.amount = item.originalAmount ?? item.amount
      item.originalAmount = undefined
    } else {
      item.originalAmount = item.amount
      item.amount = item.amount + editAmount
    }

    await cache.write(accountCacheKey, statement)

    createAlert('Successfuly updated', '', 'Ok').present()
  }

  async editStatementItem(parentScriptName?: string) {
    const accountCacheKey = await this.getAccountCacheKey(parentScriptName)
    const { currentPeriod: { statement } }: StatementCacheT = await cache.read(accountCacheKey)

    const editAlert = createAlert('Select operation to edit', '', 'Cancel')
    const actions: {summary: string, dateIndex: number, opIndex: number, originalAmount?: number, amount: number}[] = []

    for (let dateIndex = statement.length - 1; dateIndex > 0; dateIndex--) {
      const date = statement[dateIndex]

      if (date) {
        for (let opIndex = date.length - 1; opIndex >= 0; opIndex--) {
          const opItem = date[opIndex]

          if (!opItem) {
            continue
          }

          const { amount, description, originalAmount } = opItem
          const summary = `${amount / 100}${CURRENCIES[980].sign}${originalAmount ? '[E]' : ''}: "${description.replace('\n', '_')}"`

          editAlert.addAction(summary)
          actions.push({ summary, dateIndex, opIndex, originalAmount, amount })
        }
      }
    }

    const opActionIndex = await editAlert.presentSheet()

    if (opActionIndex === -1) {
      return
    }

    let editActionIndex = -1
    let amount: number | null = 0

    const { originalAmount, amount: currentAmount } = actions[opActionIndex]
    const valueAlert = createAlert('Edit operation', `Current amount is: ${currentAmount / 1e2}.\nEnter either positive or negative value to add:`, 'Cancel')

    valueAlert.addTextField('Amount:')
    valueAlert.addAction('Submit')

    if (originalAmount) {
      valueAlert.addDestructiveAction('Restore this operation')
    } else {
      valueAlert.addDestructiveAction('Delete this operation')
    }

    const valueActionIndex = await valueAlert.present()

    editActionIndex = valueActionIndex

    switch (valueActionIndex) {
      case -1: break
      case 0: amount = Number(valueAlert.textFieldValue(0)) * 1e2; break
      case 1: amount = originalAmount ? null : -1 * currentAmount; break
    }

    if (editActionIndex === -1) {
      return
    }

    const { dateIndex, opIndex } = actions[opActionIndex]
    const actionSummary = amount === null ? `restored to ${(originalAmount ?? 0) / 1e2}` : `edited for ${amount / 1e2}.\nNew value: ${currentAmount / 1e2 + amount / 1e2}`
    const confirmationAlert = createAlert('Are you sure?', `${actions[opActionIndex].summary} will be ${actionSummary}.`, 'Cancel')

    confirmationAlert.addDestructiveAction('Submit')

    const confirmationIndex = await confirmationAlert.presentSheet()

    if (confirmationIndex === -1) {
      return
    }

    await this.editOP({ date: dateIndex, day: opIndex, amount }, parentScriptName)
  }

  async setup() {
    if (!this.parentScriptName) {
      return
    }

    if (!this.isTokenProvided()) {
      await this.setupToken()
    }

    const settings = await this.readSettings() ?? {}
    const scriptSettings = settings[this.parentScriptName]

    if (!scriptSettings || !scriptSettings.accountId) {
      await this.setupAccount()
      await this.setupFilters()
    }
  }

  async pickScript() {
    const settngs = await this.readSettings()
    const keys = Object.keys(settngs ?? {})
    const selectScriptAlert = createAlert('Select script to modify', '', 'Cancel')

    if (!keys.length) {
      return
    }

    keys.forEach(item => {
      selectScriptAlert.addAction(item)
    })

    const keyIndex = await selectScriptAlert.presentSheet()

    return keys[keyIndex]
  }

  async showSettings() {
    const settingsAlert = createAlert('Monobank settngs', '', 'Cancel')

    settingsAlert.addAction('Manage auth token')
    settingsAlert.addAction('Change account number')
    settingsAlert.addAction('Set filters')
    settingsAlert.addAction('Edit statement')

    const actionIndex = await settingsAlert.present()

    switch (actionIndex) {
      case -1: break
      case 0: await this.setupToken(); break
      case 1: {
        const scriptName = await this.pickScript()

        if (scriptName) {
          await this.setupAccount(scriptName)
        }

        break
      }
      case 2: {
        const scriptName = await this.pickScript()

        if (scriptName) {
          await this.setupFilters(scriptName)
        }

        break
      }
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      case 3: {
        const scriptName = await this.pickScript()

        if (scriptName) {
          await this.editStatementItem(scriptName)
        }

        break
      }
    }
  }
}

if (config.runsInApp && Script.name() === SCRIPT_NAME) {
  const monobank = new Monobank()

  monobank.showSettings()
}
