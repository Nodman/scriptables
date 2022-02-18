// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: columns;

/*
 * author: https://github.com/Nodman
 * small widget layout with graph
 */

'use strict'

import { getDynamicGradient, getDynamicColor, parseWidgetParams, getDeviceAppearance } from './utils'
import type { PaletteT } from './utils.types'
import { TinyCharts } from './tiny-charts'

const SCRIPT_NAME = 'tiny-dashboard'
const GAP = 10
const SYMBOL_SIZE = 16
const GRAPH_OPACITY = 0.3
const GRAPH_WIDTH = 510
const GRAPH_HEIGHT = 150

/*
 * most of the colors taken from https://uigradients.com/
 */
export const PALETTES: Record<string, PaletteT> = {
  // darker ? palettes
  seablue: {
    bgStart: '#2b5876',
    bgEnd: '#4e4376',
    primary: '#ece9e6',
    secondary: '#7d7795',
  },
  cloud: {
    bgStart: '#141E30',
    bgEnd: '#243B55',
    primary: '#d0d0da',
    secondary: '#141E30',
  },
  midnight: {
    bgStart: '#232526',
    bgEnd: '#414345',
    primary: '#ece9e6',
    secondary: '#232526',
  },
  // lighter palettes, kinda. I am bad with colors
  royal: {
    bgStart: '#ece9e6',
    bgEnd: '#ffffff',
    primary: '#141E30',
    secondary: '#c2bbb5',
  },
  dull: {
    bgStart: '#c9d6ff',
    bgEnd: '#e2e2e2',
    primary: '#000c40',
    secondary: '#99b1fe',
  },
  anamnisar: {
    bgStart: '#9796f0',
    bgEnd: '#fbc7d4',
    primary: '#1D2B64',
    secondary: '#9796f0',
  },
  ash: {
    bgStart: '#606c88',
    bgEnd: '#3f4c6b',
    primary: '#c9d6ff',
    secondary: '#c9d6ff',
  },
  // other color presets
  pacific: {
    bgStart: '#0f3443',
    bgEnd: '#34e89e',
    primary: '#BDFFF3',
    secondary: '#0f3443',
  },
  sin: {
    bgStart: '#93291E',
    bgEnd: '#ED213A',
    primary: '#340707',
    secondary: '#333333',
  },
  sandblue: {
    bgStart: '#DECBA4',
    bgEnd: '#3E5151',
    primary: '#243737',
    secondary: '#3E5151',
  },

  // nord colors taken from https://www.nordtheme.com
  nord: {
    bgStart: '#2E3440',
    bgEnd: '#2E3440',
    primary: '#81a1c1',
    accent: '#d8dee9',
    secondary: '#d8dee9',
  },
  nordlight: {
    bgStart: '#d8dee9',
    bgEnd: '#d8dee9',
    primary: '#4c566a',
    accent: '#5e81ac',
    secondary: '#81a1c1',
  },
}

const TYPOGRAPHY = {
  title: 40,
  subtitle: 15,
  body: 10,
  caption: 8,
}

function getPalette(palette: { light?: string, dark?: string } = {}) {
  const { light, dark } = parseWidgetParams(args.widgetParameter)

  return {
    light: PALETTES[palette.light ?? light] ?? PALETTES.dull,
    dark: PALETTES[palette.dark ?? dark] ?? PALETTES.sandblue,
  }
}

type ArgsT = {
  header: string,
  headerSymbol?: string,
  value: string,
  subValue?: string,
  subtitle1?: string,
  subtitle2?: string,
  chartData?: number[],
}

export function createWidget(args: ArgsT, theme?: { light?: string, dark?: string }) {
  const {
    value,
    chartData,
    subtitle1,
    subtitle2,
    headerSymbol: headerSymbolProp,
    header,
    subValue,
  } = args

  const appearence = getDeviceAppearance()
  const palette = getPalette(theme)
  const listWidget = new ListWidget()
  const textColor = getDynamicColor(palette, 'primary')
  const titleColor = getDynamicColor(palette, 'accent')
  const gradient = getDynamicGradient(palette)
  const opacity = palette[appearence].bgStart === palette[appearence].bgEnd ? 1 : GRAPH_OPACITY
  const fillColor = getDynamicColor(palette, 'secondary', opacity)

  listWidget.setPadding(GAP, 0, 0, 0)

  gradient.locations = [0.0, 1]
  listWidget.backgroundGradient = gradient

  // HEADER
  const headerStack = listWidget.addStack()
  const headerText = headerStack.addText(header)

  headerStack.setPadding(0, GAP, 0, GAP)
  headerText.textColor = textColor
  headerText.font = Font.regularSystemFont(TYPOGRAPHY.body)
  headerText.minimumScaleFactor = 0.50

  if (headerSymbolProp) {
    const headerSymbol = SFSymbol.named(headerSymbolProp)

    headerSymbol.applyFont(Font.systemFont(SYMBOL_SIZE))
    headerSymbol.applySemiboldWeight

    headerStack.addSpacer()

    const currencySymbolImg = headerStack.addImage(headerSymbol.image)

    currencySymbolImg.resizable = false
    currencySymbolImg.tintColor = textColor
    currencySymbolImg.imageSize = new Size(SYMBOL_SIZE, SYMBOL_SIZE)
  }

  listWidget.addSpacer()

  // VALUE
  const valueStack = listWidget.addStack()

  valueStack.setPadding(0, GAP, 1, GAP)
  valueStack.bottomAlignContent()
  valueStack.spacing = 2

  const valueText = valueStack.addText(value)

  valueText.textColor = titleColor
  valueText.font = Font.boldSystemFont(TYPOGRAPHY.title)
  valueText.minimumScaleFactor = 0.50

  if (subValue) {
    const subValueStack = valueStack.addStack()
    const subValueText = subValueStack.addText(subValue)

    // hack to proper align text
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    subValueStack.setPadding(0, 0, 6, 0)

    subValueText.textColor = titleColor
    subValueText.font = Font.boldSystemFont(TYPOGRAPHY.body)
    subValueText.minimumScaleFactor = 0.50
  }

  // FOOTER
  const footerStack = listWidget.addStack()

  const footerStackBottomPadding = (2 - [subtitle1, subtitle2].reduce((acc, item) => acc + (item ? 1 : 0), 0)) * GAP

  footerStack.setPadding(0, GAP, footerStackBottomPadding, 0)
  footerStack.layoutVertically()
  footerStack.spacing = 2

  if (subtitle1) {
    const subtitle1Text = footerStack.addText(subtitle1)

    subtitle1Text.textColor = textColor
    subtitle1Text.font = Font.lightSystemFont(TYPOGRAPHY.caption)
  }

  if (subtitle2) {
    const subtitle2Text = footerStack.addText(subtitle2)

    subtitle2Text.textColor = textColor
    subtitle2Text.font = Font.lightSystemFont(TYPOGRAPHY.caption)
  }


  listWidget.addSpacer(GAP / 2)

  // GRAPH
  const graphStack = listWidget.addStack()

  graphStack.setPadding(0, 0, 0, 0)
  graphStack.backgroundColor = Color.clear()

  if (chartData) {
    const chart = new TinyCharts(GRAPH_WIDTH, GRAPH_HEIGHT)

    chart.setFillColor(fillColor)
    chart.drawAreaChart(chartData)

    graphStack.addImage(chart.getImage())
  } else {
    listWidget.addSpacer(GAP)
    listWidget.addSpacer()
  }

  return listWidget
}

Script.complete()
