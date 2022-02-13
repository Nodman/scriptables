// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: check-circle;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const SCRIPTS = ['utils', 'tiny-dashboard', 'tiny-charts', 'mono-monthly-small', 'update-code', 'monobank'];
const URL = 'https://raw.githubusercontent.com/Nodman/scripables/main/build'; // taken from Max Zeryck blur script

const updateCode = async url => {
  const alert = new Alert();
  alert.title = `Update "${Script.name()}" code?`;
  alert.addCancelAction('Nope');
  alert.addAction('Yesh');
  const actionIndex = await alert.present();

  if (actionIndex === -1) {
    return;
  } // Determine if the user is using iCloud.


  let files = FileManager.local();
  const iCloudInUse = files.isFileStoredIniCloud(module.filename); // If so, use an iCloud file manager.

  files = iCloudInUse ? FileManager.iCloud() : files;
  let message = ''; // Try to download the file.

  try {
    const req = new Request(url);
    const codeString = await req.loadString();
    files.writeString(module.filename, codeString);
    message = 'The code has been updated. If the script is open, close it for the change to take effect.';
  } catch {
    message = 'The update failed. Please try again later.';
  }

  const confirmAlert = new Alert();
  confirmAlert.title = 'Update code';
  confirmAlert.message = message;
  confirmAlert.addCancelAction('Ok');
  await confirmAlert.present();
};

const selectScriptAlert = new Alert();
selectScriptAlert.title = 'Select script to update';
selectScriptAlert.addCancelAction('Cancel');
SCRIPTS.forEach(item => {
  selectScriptAlert.addAction(item);
});
const actionIndex = await selectScriptAlert.presentSheet();

if (actionIndex !== -1) {
  const url = `${URL}/${SCRIPTS[actionIndex]}.js`;
  await updateCode(url);
}