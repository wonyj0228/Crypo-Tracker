import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { useMatch } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { fetchCoinInfo, fetchCoinTickers } from '../api';

// Component
const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 15vh;
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

const Overview = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 20px 20px;
  border-radius: 10px;

  background-color: rgba(0, 0, 0, 0.5);
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Description = styled.p`
  margin: 20px 0px;
`;

const Taps = styled.div`
  display: grid;
  margin: 25px 0px;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
`;

const Tap = styled.span<{ $isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 13px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;

  color: ${(props) =>
    props.$isActive ? props.theme.accentColor : props.theme.textColor};

  a {
    display: block;
    padding: 7px 0px;
  }
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
  // useParams v6버전부터 반드시 string | undefined로 자동설정됨
  const { coinId } = useParams<{ coinId: string }>();
  const { state } = useLocation() as RouteState;

  // 현재 url의 위치가 match한지 알려주는 react router dom의 hook
  const priceMatch = useMatch('/:coinId/price');
  const chartMatch = useMatch('/:coinId/chart');

  // useQuery function자리에 undefined는 갈 수 없어서 string 강제로 만들어줌
  // react query 캐시 시스템에서 저장되고 작동하기 위해선 key값은 고유한 값이어야 함
  // key값을 array로 줘서, 0번엔 카테고리, 1번엔 id를 줌
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ['info', coinId],
    () => fetchCoinInfo(`${coinId}`)
  );
  // fetch를 interval로 보낼 수 있음. 밀리초 단위로 계속해서 refetch시킴.
  // option 중 하나로 option엔 다양한 것이 있으니 참조
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ['tickers', coinId],
    () => fetchCoinTickers(`${coinId}`),
    {
      refetchInterval: 5000,
    }
  );

  const loading = infoLoading || tickersLoading;
  /*
  const [loading, setLoading] = useState(true);
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

      setInfo(infoData);
      setPriceInfo(priceData);
      setLoading(false);
    })();
  }, [coinId]);
*/

  // optional chaining 사용하기
  // infoData?.~~.~~
  // ?.이란
  // ?. 앞의 평가대상이 undefined나 null이면 평가를 멈추고 undefined를 반환한다. 에러를 반환하지 않음.

  // Nested Routes : 페이지 내부에서 또다른 페이지를 연결해주는 것
  // ex ) 주소 / coinId / price => price, chart는 새로운 페이지

  // Router.tsx에서 children 추가
  // Outlet 추가 (react-router-dom)

  // Link를 사용해 url만 바꿈. a태그는 refresh가 발생하기 때문에 사용하지 않았음
  // a태그로 이동하면 상태값을 모두 잃고 속도가 저하됨
  // Link는 페이지를 새로 불러오지 않기 때문에 Link 사용을 권장

  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? 'Loading...' : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <Title>
          {state?.name ? state.name : loading ? 'Loading...' : infoData?.name}
        </Title>
      </Header>

      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>{infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>{tickersData?.quotes.USD.price.toFixed(3)}</span>
            </OverviewItem>
          </Overview>

          <Description>{infoData?.description}</Description>

          <Overview>
            <OverviewItem>
              <span>Total Supply:</span>
              <span>{tickersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{tickersData?.max_supply}</span>
            </OverviewItem>
          </Overview>

          <Taps>
            <Tap $isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tap>
            <Tap $isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tap>
          </Taps>

          <Outlet context={{ coinId }} />
        </>
      )}
    </Container>
  );
}

// Outlet에 props를 넘겨줄 때는 context 사용하기
export default Coin;
