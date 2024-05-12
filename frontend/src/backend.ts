
const BACKEND_URL = 'http://localhost:6969/'


export interface IResult {
  calculations: {
    rangeLowerBound: number
    rangeUpperBound: number,
    tokenATokenAmount: number,
    tokenBTokenAmount: number,
    tokenATokenUsd: number,
    tokenBTokenUsd: number,
    estDailyFee: number,
    estDailyFeeOnDays: number,
    positionValue: number,
    hodlValue: number,
    vsHodl: number
  },
  pool: {
    address: string,
    name: string,
    tokenA: string,
    tokenB: string,
    priceTokenA: number,
    priceTokenB: number,
    volume: number,
    fee: number,
    liquidity: number
  },
  params: {
    range: number,
    days: number,
  }
}

export async function getTopProfitPools(days: number, investAmount: number, query: string) {
  const res = await fetch(`${BACKEND_URL}?days=${days}&investAmount=${investAmount}&query=${query}`)
  if (res.status !== 200)
    throw new Error('Orest <3, server error')

  const responseObj = await res.json();
  return responseObj;
}
