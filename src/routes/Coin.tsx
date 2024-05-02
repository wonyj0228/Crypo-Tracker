import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';

// Component
const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 48px;
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

// Interface
interface RouteState {
  state: { name: string };
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_15m: number;
      percent_change_30m: number;
      percent_change_1h: number;
      percent_change_6h: number;
      percent_change_12h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      percent_change_1y: number;
      ath_price: number;
      ath_date: string;
      percent_from_price_ath: number;
    };
  };
}

function Coin() {
  // 데이터 선언 시, 데이터 타입 지정해줘야 함
  const [loading, setLoading] = useState(true);
  const { coinId } = useParams<{ coinId: string }>();
  const { state } = useLocation() as RouteState;

  const [info, setInfo] = useState<InfoData>();
  const [priceInfo, setPriceInfo] = useState<PriceData>();

  useEffect(() => {
    (async () => {
      const infoData = await (
        await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
      ).json();

      const priceData = await (
        await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
      ).json();

      console.log(infoData);
      console.log(priceData);

      setInfo(infoData);
      setPriceInfo(priceData);
      setLoading(false);
    })();
  }, [coinId]);

  // optional chaining 사용하기
  // infoData?.~~.~~
  // ?.이란
  // ?. 앞의 평가대상이 undefined나 null이면 평가를 멈추고 undefined를 반환한다. 에러를 반환하지 않음.

  return (
    <Container>
      <Header>
        <Title>{state?.name || 'Loading..'}</Title>
      </Header>

      {loading ? <Loader>Loading...</Loader> : null}
    </Container>
  );
}

export default Coin;
