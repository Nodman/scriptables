// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: chart-line;

/*
 * author: https://github.com/Nodman
 * small chart, for now supports only area chart
 */

'use strict'

const SCRIPT_NAME = 'tiny-charts'

export class TinyCharts {
  context: DrawContext
  width: number
  height: number
  strokeColor?: Color
  fillColor?: Color

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  private createContext() {
    this.context = new DrawContext()
    this.context.size = new Size(this.width, this.height)
    this.context.opaque = false
    this.context.respectScreenScale = true
    this.context.setLineWidth(1)
  }

  private normalizeData(data: number[]) {
    const maxValue = Math.max(...data)
    const normalized = data.map(value => value / (maxValue / 1e2))

    return normalized
  }

  private getCoordinates(data: number[], index: number) {
    const y = this.height - (this.height * data[index]) / 100
    const x = index * (this.width / (data.length - 1))

    return { x, y }
  }

  setFillColor(color: Color) {
    this.fillColor = color
  }

  setStrokeColor(color: Color) {
    this.strokeColor = color
  }

  drawAreaChart(rawData: number[]) {
    this.createContext()

    const data = this.normalizeData(rawData)
    const startingPoint = this.getCoordinates(data, 0)
    const path = new Path()

    path.move(new Point(startingPoint.x, startingPoint.y))

    for (let index = 0; index < data.length - 1; index++) {
      const point = this.getCoordinates(data, index)
      const nextPoint = this.getCoordinates(data, index + 1)

      const pointX = (point.x + nextPoint.x) / 2
      const pointY = (point.y + nextPoint.y) / 2
      const controlx1 = (pointX + point.x) / 2
      const controlx2 = (pointX + nextPoint.x) / 2

      path.addQuadCurve(new Point(pointX, pointY), new Point(controlx1, point.y))
      path.addQuadCurve(new Point(nextPoint.x, nextPoint.y), new Point(controlx2, nextPoint.y))
    }

    path.addLine(new Point(this.width, this.height))
    path.addLine(new Point(0, this.height))
    path.closeSubpath()

    if (this.strokeColor) {
      this.context.setStrokeColor(this.strokeColor)
      this.context.addPath(path)
      this.context.strokePath()
    }

    if (this.fillColor) {
      this.context.setFillColor(this.fillColor)
      this.context.addPath(path)
      this.context.fillPath()
    }
  }

  getContext() {
    return this.context
  }

  getImage() {
    return this.context.getImage()
  }
}

Script.complete()
