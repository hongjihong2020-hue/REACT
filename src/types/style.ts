export interface StyleReport {
  bodyType: {
    type: string
    description: string
  }
  recommendedStyles: string[]
  colorPalette: {
    recommended: string[]
    avoid: string[]
  }
  avoidStyles: string[]
  stylingTips: string[]
}
