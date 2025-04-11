export function isEvenNumber(value: number) {
     return Math.round(value * 10000) % 2 === 0
}

export function isHighlight(currency: string, value: number) {
     return isEvenNumber(value) || currency === 'HKD'
}
