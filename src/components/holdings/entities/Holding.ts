export default class Holding {
    public ticker: string
    public amount: number
    public currentPrice?: number

    constructor(ticker: string, amount: number, currentPrice?: number) {
        this.ticker = ticker
        this.amount = amount
        this.currentPrice = currentPrice
    }
}