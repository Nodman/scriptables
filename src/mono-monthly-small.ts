// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: hand-holding-usd;

/*
 * author: https://github.com/Nodman
 * track expanses from monobank account with small widget
 */

'use strict'

import { createWidget } from './tiny-dashboard'
import { numberFormatterShort, parseWidgetParams } from './utils'
import { Monobank } from './monobank'

const SCRIPT_NAME = 'mono-monthly-small'

const dateFormatter = new DateFormatter()

dateFormatter.useShortTimeStyle()

async function exec() {
  const { name = SCRIPT_NAME } = parseWidgetParams(args.widgetParameter)
  const monobank = new Monobank(name)

  await monobank.setup()

  const { currentPeriod, history } = await monobank.fetchLatestStatement()

  const todaysValue = Monobank.getTodaysExpanses({ currentPeriod })

  const { monthlyHistory, daily, monthly } = Monobank.getStatsForPeriod({ history })

  monthlyHistory.push(currentPeriod.total)

  const widget = createWidget({
    chartData: monthlyHistory,
    subtitle1: `${numberFormatterShort(daily / 100)} DAILY / ${numberFormatterShort(monthly / 100)} MONTHLY`,
    subtitle2: `UPDATED: ${dateFormatter.string(new Date())}`,
    value: numberFormatterShort(currentPeriod.total / 100),
    subValue: `/ ${numberFormatterShort(todaysValue / 100)}`,
    headerSymbol: 'hryvniasign.circle',
    header: 'CURRENT MONTH:',
  })

  Script.setWidget(widget)

  return widget
}


if (config.runsInApp) {
  const widget = await exec()

  await widget.presentSmall()
} else {
  await exec()
}

Script.complete()
