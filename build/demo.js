"use strict";

/* eslint-disable @typescript-eslint/no-magic-numbers */
const {
  createWidget
} = importModule("./tiny-dashboard");
const {
  numberFormatterShort
} = importModule("./utils");
const dateFormatter = new DateFormatter();
dateFormatter.useShortTimeStyle();

function exec() {
  const widget = createWidget({
    chartData: [89, 100, 69, 190, 59, 22, 40],
    subtitle1: `${numberFormatterShort(1400)} DAILY / ${numberFormatterShort(12780)} MONTHLY`,
    subtitle2: `UPDATED: ${dateFormatter.string(new Date())}`,
    value: numberFormatterShort(2888),
    subValue: `/ ${numberFormatterShort(190)}`,
    headerSymbol: 'hryvniasign.circle',
    header: 'CURRENT MONTH:'
  }, {
    dark: 'midnight'
  });
  widget.presentSmall();
}

exec();
Script.complete();