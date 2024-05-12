import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Card, Container, Spinner} from "react-bootstrap";
import {getTopProfitPools, IResult} from "./backend";


export default function App() {
  const [data, setData] = useState<IResult[]>([]);
  const [inputAmount, setInputAmount] = useState("10000");
  const [inputDays, setInputDays] = useState("5");
  const [inputSearchQuery, setInputSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onClick() {
    setIsLoading(true);
    const resultFromBackEnd = await getTopProfitPools(+inputDays, +inputAmount, inputSearchQuery)
    setData(resultFromBackEnd);
    setIsLoading(false);
  }

  return (
    <Container>
      <Form style={{padding: "10px"}}>
        <Form.Group className="mb-3">
          <Form.Label>Ваш депозит</Form.Label>
          <Form.Control type="number" placeholder="$" value={inputAmount}
                        onChange={(e) => setInputAmount(e.target.value)}/>
          <Form.Text className="text-muted"> Максимальна кількість USD яку Ви готові вкласти в еквівалент
            токенів </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Тривалість депозиту </Form.Label>
          <Form.Control type="number" placeholder="в днях" value={inputDays}
                        onChange={(e) => setInputDays(e.target.value)}/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Фільтр токенів </Form.Label>
          <Form.Control type="text" value={inputSearchQuery} onChange={(e) => setInputSearchQuery(e.target.value)}/>
          <Form.Text className="text-muted"> Використовуйте це поле, щоб фільтрувати результати по даному токену,
            наприклад BTC </Form.Text>
        </Form.Group>


        {isLoading ?
          <Button variant="primary" disabled>
            <Spinner animation="border" role="status" size={"sm"}/>
            {' '}Завантаження...
          </Button> :
          <Button variant="primary" onClick={onClick} disabled={isLoading}> Почати </Button>
        }
      </Form>

      <hr/>

      { !isLoading &&
          data.map((pool, i) =>
            <PoolResult result={pool} key={i}/>
          )
      }

    </Container>
  );
}


function PoolResult({result}: { result: IResult }) {

  const {pool, calculations, params} = result;
  const tA = pool.tokenA;
  const tB = pool.tokenB;


  return <Card style={{marginBottom: "20px"}}>
    <Card.Body>

      <Card.Title>
        <div className={'fw-semibold'}> {pool.name} </div>
        <div> Потенціальний профіт: {round(calculations.vsHodl)} $USD</div>
      </Card.Title>

      <Card.Text>
        Інформація про пул:
        <div className={'fw-light'}>
          <div>Всього ліквідності: <strong>{round(pool.liquidity)} $USD</strong></div>
          <div>Денний об'єм свопів: <strong>{round(pool.volume)} $USD</strong></div>
        </div>

        <br/>

        Необхідно купити:
        <div className={'fw-light'}>
          <div> Загальна вартість позиції: <strong>{round(calculations.positionValue)} $USD</strong></div>

          <div>
            <strong>{round(calculations.tokenATokenAmount)} ${tA}</strong>
            <span className={'fw-light'}> = {round(calculations.tokenATokenUsd)} $USD</span>
          </div>
          <div>
            <strong> {round(calculations.tokenBTokenAmount)} ${tB}</strong>
            <span className={'fw-light'}> = {round(calculations.tokenBTokenUsd)} $USD</span>
          </div>
        </div>

        <br/>

        Необхідно встановити:
        <div className={'fw-light'}>
          <div> Верхній ліміт: <strong>{round(calculations.rangeUpperBound)} ${tB}</strong></div>
          <div> Нижній ліміт: <strong>{round(calculations.rangeLowerBound)} ${tB}</strong></div>
        </div>

        <br/>

        Прибуток:
        <div className={'fw-light'}>
          <div> Прибуток від комісії в день: <strong>{round(calculations.estDailyFee)} $USD</strong></div>
          <div> Прибуток від комісії
            за <strong>{params.days}</strong> дні: <strong>{round(calculations.estDailyFeeOnDays)} $USD</strong></div>

        </div>
      </Card.Text>

      <Button href={'https://www.geckoterminal.com/eth/pools/' + pool.address}
              variant={'success'}>Інвестувати</Button>

    </Card.Body>
  </Card>
}


function round(value: number) {
  if (!value) return value;

  if (value < 10)
    return value.toFixed(4);
  if (value < 100)
    return value.toFixed(3);
  if (value < 1000)
    return value.toFixed(2);
  if (value < 10000)
    return value.toFixed(1);
  return value.toFixed(0);

}
