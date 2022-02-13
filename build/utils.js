// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: wrench;

/*
 * author: https://github.com/Nodman
 * few common utils I use across scriptable widgets
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.currencyFormatter = exports.createAlert = exports.Logger = void 0;
exports.fetchJson = fetchJson;
exports.sendNotification = exports.sendErrorNotification = exports.parseWidgetParams = exports.numberFormatterShort = exports.getDynamicGradient = exports.getDynamicColor = exports.getDeviceAppearance = exports.getDaysInMonth = void 0;
const SCRIPT_NAME = 'utils';
const DEBUG = true;
const ERROR_NOTIFICATION_ID = '_error';

class Logger {
  constructor(prefix) {
    this.prefix = prefix ?? '';
    this.separator = prefix ? ': ' : '';
  }

  print(method, message) {
    if (!DEBUG) {
      return;
    } // eslint-disable-next-line no-console


    console[method](`${this.prefix}${this.separator}${message}`);
  }

  log(message) {
    this.print('log', message);
  }

  warn(message) {
    this.print('warn', message);
  }

  error(message) {
    this.print('error', message);
  }

}

exports.Logger = Logger;
const requestLogger = new Logger('Request');

async function fetchJson(url, headers) {
  try {
    const req = new Request(url);
    req.headers = headers ?? {};
    requestLogger.log(url);
    return await req.loadJSON();
  } catch (error) {
    requestLogger.error(JSON.stringify(error));
    throw new Error(error);
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


const sendNotification = ({
  title,
  message,
  id = 'notification',
  userInfo,
  date,
  actions = [],
  scriptName,
  openURL
}) => {
  const notification = new Notification();
  notification.title = title;
  notification.identifier = `${Script.name()}${id}`;
  notification.threadIdentifier = `${Script.name()}${id}_thread`;

  if (userInfo) {
    notification.userInfo = {
      error: true
    };
  }

  if (date) {
    notification.setTriggerDate(date);
  }

  if (openURL) {
    notification.openURL = openURL;
  }

  actions.forEach(action => {
    notification.addAction(...action);
  });
  notification.scriptName = scriptName || Script.name();
  notification.body = message;
  notification.schedule();
};

exports.sendNotification = sendNotification;

const sendErrorNotification = (err, params) => {
  sendNotification({ ...params,
    title: `Something went wrong with ${Script.name()}`,
    id: ERROR_NOTIFICATION_ID,
    message: err.message
  });
};

exports.sendErrorNotification = sendErrorNotification;

const createAlert = (title, message, cancelAction) => {
  const alert = new Alert();
  alert.message = message;
  alert.title = title;

  if (cancelAction) {
    alert.addCancelAction(cancelAction);
  }

  return alert;
}; // starts from 1


exports.createAlert = createAlert;

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

exports.getDaysInMonth = getDaysInMonth;

const getDynamicColor = ({
  light,
  dark
}, key, opacity) => {
  const lightColor = light[key] ?? light.primary;
  const darkColor = dark[key] ?? dark.primary;
  return Color.dynamic(new Color(lightColor, opacity), new Color(darkColor, opacity));
};

exports.getDynamicColor = getDynamicColor;

const getDynamicGradient = ({
  dark,
  light
}) => {
  const startColor = Color.dynamic(new Color(light.bgStart), new Color(dark.bgStart));
  const endColor = Color.dynamic(new Color(light.bgEnd), new Color(dark.bgEnd));
  const gradient = new LinearGradient();
  gradient.colors = [startColor, endColor];
  return gradient;
};

exports.getDynamicGradient = getDynamicGradient;

const parseWidgetParams = params => {
  if (typeof params !== 'string') {
    return {};
  }

  return params.split(';').reduce((acc, item) => {
    const [key, value = ''] = item.split('=');
    return { ...acc,
      [key.trim()]: value.trim() ?? true
    };
  }, {});
};

exports.parseWidgetParams = parseWidgetParams;
const numberFormatterShort = new Intl.NumberFormat('ua', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
  minimumFractionDigits: 0
}).format;
exports.numberFormatterShort = numberFormatterShort;
const currencyFormatter = new Intl.NumberFormat('uk-UA', {
  minimumFractionDigits: 2
}).format;
exports.currencyFormatter = currencyFormatter;

const getDeviceAppearance = () => {
  return Device.isUsingDarkAppearance() ? 'dark' : 'light';
};

exports.getDeviceAppearance = getDeviceAppearance;
Script.complete();