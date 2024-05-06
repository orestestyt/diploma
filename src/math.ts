const sqrt = Math.sqrt;
const min = Math.min;

export function calculate(tokenACurrentPrice: number, tokenBCurrentPrice: number, poolFee: number, existingLiquidityValue: number, dailySwapVolume: number, range: number, daysHeld: number, usdInvestment: number) {
    const currentPoolPrice = tokenACurrentPrice / tokenBCurrentPrice;
    const rangeLowerBound = currentPoolPrice * (1 - range);
    const rangeUpperBound = currentPoolPrice * (1 + range);
    const newTokenAUsdPrice = tokenACurrentPrice * 0.95;
    const newTokenBUsdPrice = tokenBCurrentPrice * 0.95;

    const C28 = (sqrt(currentPoolPrice) - sqrt(rangeLowerBound)) / ((1 / sqrt(currentPoolPrice)) - (1 / sqrt(rangeUpperBound)));
    const tokenATokenAmount = usdInvestment / (tokenACurrentPrice + C28 * tokenBCurrentPrice);
    const tokenBTokenAmount = tokenATokenAmount * C28;

    const tokenATokenUsd = tokenATokenAmount * tokenACurrentPrice;
    const tokenBTokenUsd = tokenBTokenAmount * tokenBCurrentPrice;

    const liquidityValue = calcLiquidityValue(currentPoolPrice, rangeLowerBound, tokenATokenAmount, rangeUpperBound, tokenBTokenAmount);
    const liquidityShare = liquidityValue / (liquidityValue + existingLiquidityValue);
    const estDailyFee = liquidityShare * dailySwapVolume * poolFee;

    const feePercentage = estDailyFee / usdInvestment * 365;


    // future

    const newPoolPrice = newTokenAUsdPrice / newTokenBUsdPrice;

    const newTokenATokenAmount = calcTokenANewAmount(newPoolPrice, rangeLowerBound, liquidityValue, rangeUpperBound)
    const newTokenAUsdValue = newTokenATokenAmount * newTokenAUsdPrice;


    const newTokenBTokenAmount = calcTokenBNewAmount(newPoolPrice, rangeLowerBound, rangeUpperBound, liquidityValue)
    const newTokenBUsdValue = newTokenBUsdPrice * newTokenBTokenAmount;


    const positionValue = newTokenAUsdValue + newTokenBUsdValue;

    const tokenAUsdHodlValue = tokenATokenAmount * newTokenAUsdPrice;
    const tokenBUsdHodlValue = tokenBTokenAmount * newTokenBUsdPrice;
    const hodlValue = tokenAUsdHodlValue + tokenBUsdHodlValue;
    const positionValueVsHodl = positionValue - hodlValue;


    const estDailyFeeOnDays = daysHeld * estDailyFee;
    const feePlusPositionValue = estDailyFeeOnDays + positionValue;

    const vsHodl = feePlusPositionValue - hodlValue;

    return {
        rangeLowerBound, rangeUpperBound, tokenATokenAmount, tokenBTokenAmount, tokenATokenUsd, tokenBTokenUsd,
        estDailyFee, positionValue, hodlValue, vsHodl
    };
}


function calcLiquidityValue(currentPoolPrice: number, rangeLowerBound: number, tokenATokenAmount: number, rangeUpperBound: number, tokenBTokenAmount: number) {
    if (currentPoolPrice <= rangeLowerBound)
        return (tokenATokenAmount * sqrt(rangeLowerBound) * sqrt(rangeUpperBound)) / (sqrt(rangeUpperBound) - sqrt(rangeLowerBound));

    if (currentPoolPrice > rangeUpperBound)
        return tokenATokenAmount / (sqrt(rangeUpperBound) - sqrt(rangeLowerBound));

    return min(
        tokenATokenAmount * (sqrt(rangeUpperBound) * sqrt(currentPoolPrice)) / (sqrt(rangeUpperBound) - sqrt(currentPoolPrice)),
        tokenBTokenAmount / (sqrt(currentPoolPrice) - sqrt(rangeLowerBound))
    );
}

function calcTokenANewAmount(newPoolPrice: number, rangeLowerBound: number, liquidityValue: number, rangeUpperBound: number) {
    if (newPoolPrice > rangeUpperBound)
        return 0;

    const boundedPrice = Math.max(newPoolPrice, rangeLowerBound)
    return (liquidityValue / sqrt(boundedPrice)) - (liquidityValue / sqrt(rangeUpperBound));

}

function calcTokenBNewAmount(newPoolPrice: number, rangeLowerBound: number, rangeUpperBound: number, liquidityValue: number) {
    if (newPoolPrice < rangeLowerBound)
        return 0;

    const boundedPrice = min(newPoolPrice, rangeUpperBound)
    return liquidityValue * sqrt(boundedPrice) - liquidityValue * sqrt(rangeLowerBound);

}
