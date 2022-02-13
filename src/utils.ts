/*
 * Variables used by Scriptable.
 * These must be at the very top of the file. Do not edit.
 * icon-color: deep-purple; icon-glyph: wrench;
 */

/*
 * author: https://github.com/Nodman
 * few common utils I use across scriptable widgets
 */

import { PaletteT, DynamicPaletteT } from './utils.types'

const DEBUG = true
const ERROR_NOTIFICATION_ID = '_error'

export class Logger {
  private prefix?: string
  private separator: string

  constructor(prefix?: string) {
    this.prefix = prefix ?? ''
    this.separator = prefix ? ': ' : ''
  }

  private print(method: 'warn' | 'log' | 'error', message: string) {
    if (!DEBUG) {
      return
    }

    // eslint-disable-next-line no-console
    console[method](`${this.prefix}${this.separator}${message}`)
  }

  log(message: string): void {
    this.print('log', message)
  }

  warn(message: string): void {
    this.print('warn', message)
  }

  error(message: string): void {
    this.print('error', message)
  }
}

const requestLogger = new Logger('Request')

export async function fetchJson<R = unknown>(url: string, headers?: Record<string, string>): Promise<R> {
  try {
    const req = new Request(url)

    req.headers = headers ?? {}

    requestLogger.log(url)

    return await req.loadJSON()
  } catch (error) {
    requestLogger.error(JSON.stringify(error))

    throw new Error(error)
  }
}

/**
 * Send notification
 *
 * @param {string} title Notification title
 * @param {string} message Notification body
 * @param {string} id Notification id
 * @param {*} userInfo Notification userInfo object
 * @param {Date} date Schedule date, if not provided - will be scheduled asap
 * @param {*} actions Array of actions, [[title, action]]
 * @param {string} scriptName Explicit scriptName
 * @param {string} openURL url to open when click on notification
 */
type SendNotificationT = (params: {
  title: string,
  message: string,
  id?: string,
  userInfo?: Record<string, string>,
  date?: Date,
  actions?: [title: string, action: string, destructive?: boolean][],
  scriptName?: string,
  openURL?: string,
}) => void

export const sendNotification: SendNotificationT = ({
  title,
  message,
  id = 'notification',
  userInfo,
  date,
  actions = [],
  scriptName,
  openURL,
}) => {
  const notification = new Notification()

  notification.title = title
  notification.identifier = `${Script.name()}${id}`
  notification.threadIdentifier = `${Script.name()}${id}_thread`

  if (userInfo) {
    notification.userInfo = { error: true }
  }

  if (date) {
    notification.setTriggerDate(date)
  }

  if (openURL) {
    notification.openURL = openURL
  }

  actions.forEach(action => {
    notification.addAction(...action)
  })

  notification.scriptName = scriptName || Script.name()
  notification.body = message
  notification.schedule()
}

export const sendErrorNotification = (err: Error, params: Parameters<SendNotificationT>[0]) => {
  sendNotification({
    ...params,
    title: `Something went wrong with ${Script.name()}`,
    id: ERROR_NOTIFICATION_ID,
    message: err.message,
  })
}

export const createAlert = (title: string, message: string, cancelAction?: string): Alert => {
  const alert = new Alert()

  alert.message = message
  alert.title = title

  if (cancelAction) {
    alert.addCancelAction(cancelAction)
  }

  return alert
}

// starts from 1
export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate()
}

export const getDynamicColor = ({ light, dark }: DynamicPaletteT, key: keyof PaletteT, opacity?: number) => {
  const lightColor = light[key] ?? light.primary
  const darkColor = dark[key] ?? dark.primary

  return Color.dynamic(new Color(lightColor, opacity), new Color(darkColor, opacity))
}

export const getDynamicGradient = ({ dark, light }: DynamicPaletteT) => {
  const startColor = Color.dynamic(new Color(light.bgStart), new Color(dark.bgStart))
  const endColor = Color.dynamic(new Color(light.bgEnd), new Color(dark.bgEnd))

  const gradient = new LinearGradient()

  gradient.colors = [startColor, endColor]

  return gradient
}

export const parseWidgetParams = (params: unknown): Record<string, string> => {
  if (typeof params !== 'string') {
    return {}
  }

  return params.split(';').reduce((acc, item) => {
    const [key, value = ''] = item.split('=')

    return { ...acc, [key.trim()]: value.trim() ?? true }
  }, {})
}

export const numberFormatterShort = new Intl.NumberFormat('ua', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
}).format

export const currencyFormatter = new Intl.NumberFormat('uk-UA', {
  minimumFractionDigits: 2,
}).format

export const getDeviceAppearance = (): 'dark' | 'light' => {
  return Device.isUsingDarkAppearance() ? 'dark' : 'light'
}
