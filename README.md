# scriptables
my small collection of scripts to be used with [scriptable.app](https://scriptable.app)

### [tiny-dashboard](https://github.com/Nodman/scripables/blob/main/src/tiny-dashboard.ts):

<img src="https://github.com/Nodman/scripables/blob/main/.github/screenshots/tiny-dashboard/preview.png" data-canonical-src="https://github.com/Nodman/scripables/blob/main/.github/screenshots/tiny-dashboard/preview.png" width="50%" height="50%" />

Small-size widget with several text fields, graph and icon, supports dynamic dark / light mode and has 12 builtin themes.

Themes can be configured through widget params: ***dark=sandblue;light=royal***

<details>
<summary>themes preview (expandable)</summary>

*NOTE:*


*most of the colors were taken from https://uigradients.com*
*nord colors were taken from https://www.nordtheme.com*


* seablue

  ![tiny-dashboard seablue](https://github.com/Nodman/scripables/blob/main/.github/screenshots/tiny-dashboard/seablue.png?raw=true)

* cloud

  ![tiny-dashboard cloud](https://github.com/Nodman/scripables/blob/main/.github/screenshots/tiny-dashboard/cloud.png?raw=true)

* midnight
  
  ![tiny-dashboard midnight](https://github.com/Nodman/scripables/blob/main/.github/screenshots/tiny-dashboard/midnight.png?raw=true)

* royal

  ![tiny-dashboard royal](https://github.com/Nodman/scripables/blob/main/.github/screenshots/tiny-dashboard/royal.png?raw=true)

* dull

  ![tiny-dashboard dull](https://github.com/Nodman/scripables/blob/main/.github/screenshots/tiny-dashboard/dull.png?raw=true)

* anamnisar

  ![tiny-dashboard anamnisar](https://github.com/Nodman/scripables/blob/main/.github/screenshots/tiny-dashboard/anamnisar.png?raw=true)

* ash

  ![tiny-dashboard ash](https://github.com/Nodman/scripables/blob/main/.github/screenshots/tiny-dashboard/ash.png?raw=true)

* pacific

  ![tiny-dashboard pacific](https://github.com/Nodman/scripables/blob/main/.github/screenshots/tiny-dashboard/pacific.png?raw=true)

* sin

  ![tiny-dashboard sin](https://github.com/Nodman/scripables/blob/main/.github/screenshots/tiny-dashboard/sin.png?raw=true)

* sandblue

  ![tiny-dashboard sandblue](https://github.com/Nodman/scripables/blob/main/.github/screenshots/tiny-dashboard/sandblue.png?raw=true)

* nord

  ![tiny-dashboard nord](https://github.com/Nodman/scripables/blob/main/.github/screenshots/tiny-dashboard/nord.png?raw=true)

* nordlight

  ![tiny-dashboard nordlight](https://github.com/Nodman/scripables/blob/main/.github/screenshots/tiny-dashboard/nordlight.png?raw=true)

</details>



### [tiny-charts](https://github.com/Nodman/scripables/blob/main/src/tiny-charts.ts):

Script for drawing charts with context, for now supports only area-type chart as shown on screenshot above



### [monobank](https://github.com/Nodman/scripables/blob/main/src/monobank.ts):

*(WIP, expect breaking changes)*

Monobank api client: fetch, record, filter and edit statement for current month, cache history for previous monthes.

Provides UI for setting api-key, settting account per widget and and managing statement filters. Uses keychain to store api-key.

### [mono-monthly-small](https://github.com/Nodman/scripables/blob/main/src/mono-monthly-small.ts):

Monobank script + tiny dashboard (as shown on the frist screenshot)

### [utils](https://github.com/Nodman/scripables/blob/main/src/utils.ts):

Some common utils that are used across other scripts

### [update-code](https://github.com/Nodman/scripables/blob/main/src/update-code.ts):

Update code of scripts from this repo

---

this repos also contains custom bable plugin that transpiles es imprts to scriptable ***importModule*** api
