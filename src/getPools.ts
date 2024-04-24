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
        const apiAddress = item.attributes.address;
        const name = item.attributes.name;
        const priceToken1 = +item.attributes.base_token_price_usd;
        const priceToken2 = +item.attributes.quote_token_price_usd;
        const arr = item.attributes.name.split(" ");
        const fee = +arr[arr.length - 1].replace("%", "") / 100;
        const volume = +item.attributes.volume_usd.h24;
        const liquidity = +item.attributes.reserve_in_usd;
        result.push({apiAddress, name, priceToken1, priceToken2, volume, fee, liquidity});
    }
    // console.log(result)
    return result;
}