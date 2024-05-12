
const BACKEND_URL = 'http://localhost:6969/'

export async function getTopProfitPools(days: number, investAmount: number, query: string) {

  const res = await fetch(`${BACKEND_URL}?days=${days}&investAmount=${investAmount}&query=${query}`)
  if (res.status !== 200)
    throw new Error('Orest <3, server error')

  const responseObj = await res.json();
  return responseObj;
}
