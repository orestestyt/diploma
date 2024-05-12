import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors';
import { getPoolData } from "./getPools";
import { calculate } from "./math";

export async function calculateAll(days: number, investAmount: number) {
    const poolsArray = await getPoolData();
    const result = [];
    const ranges = [0.01, 0.06, 0.11, 0.16, 0.20, 0.25];
    for (const pool of poolsArray) {
        for (const range of ranges) {
            const calculations = calculate(pool.priceTokenA, pool.priceTokenB, pool.volume, pool.liquidity, pool.fee, range, days, investAmount);
            result.push({
                calculations,
                pool,
                params: { range, days }
            });
        }
    }
    result.sort((a, b) => b.calculations.vsHodl - a.calculations.vsHodl);
    return result;
}

export async function server() {

    async function getData(req: FastifyRequest, res: FastifyReply) {
        const body = req.query as any;
        const result = await calculateAll(+body.days, +body.investAmount);
        res.send(result);
    }

    const fastify = Fastify({ logger: true })
    await fastify.register(cors, { origin: '*' });

    fastify.get('/', getData)

    fastify.listen({ port: 6969, host: "0.0.0.0" }, (err: any, address: any) => {
        if (err) throw err
    })
}

server();
