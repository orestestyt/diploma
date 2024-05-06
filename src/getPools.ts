export async function getPoolData() {
    const result = [];
    for (let i = 1; i < 10; i++) {
        result.push(...await getPoolData_(i));
    }
    return result;
}

async function getPoolData_(pageNum: number) {
    const response = await fetch("https://api.geckoterminal.com/api/v2/networks/eth/dexes/uniswap_v3/pools?page=" + pageNum);
    const data = await response.json();
    const pools = data.data;
    const result = [];
    for (const item of pools) {
        const address = item.attributes.address;
        const name = item.attributes.name;
        const priceToken1 = +item.attributes.base_token_price_usd;
        const priceToken2 = +item.attributes.quote_token_price_usd;
        const {token1, token2, fee} = parsePoolName(name);
        const volume = +item.attributes.volume_usd.h24;
        const liquidity = +item.attributes.reserve_in_usd;

        // swap tokens if token1 is not the token with the highest price
        const [priceTokenA, priceTokenB, tokenA, tokenB] = (priceToken1 > priceToken2) ?
          [priceToken1, priceToken2, token1, token2] :
          [priceToken2, priceToken1, token2, token1];

        result.push({
            address, name,
            tokenA, tokenB,
            priceTokenA, priceTokenB,
            volume, fee, liquidity
        });
    }
    // console.log(result)
    return result;
}

function parsePoolName(name: string) {
    const [token1, _, token2, feeStr] = name.split(" ");
    const fee = +feeStr.replace("%", "") / 100;
    return {token1, token2, fee};
}
