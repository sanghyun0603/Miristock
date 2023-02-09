import './css/stocktrade.css';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { tradeAPI, memberAPI } from '../../api/api';
import { fontSize } from '@mui/system';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const StockTrade = () => {
  const [choose, setChoose] = useState(0);
  const [myStocks, setMyStocks] = useState([]);
  const [transaction, setTransaction] = useState([]);
  //   const [expectedTransaction, setExpectedTransaction] = useState([]);
  // const holdingStock = [
  //   {
  //     stockName: '삼성전자', //stockName
  //     stockCode: '005930', // stockCode
  //     stockJu: 400, // memberStockAmount
  //     stockAver: '63,894', // memberStockAvgPrice
  //     stockAverWon: '25,557,600', // memberStockAvgPriceSum
  //     stockNow: '64,294', //memberStockCurPrice
  //     stockNowWon: '25,717,600', //memberStockCurPriceSum
  //     stockSu: '0.63', // /memberStockCurPrice/memberStockAvgPrice * 100 -100
  //     stockSuWon: '160,000', // * memberStockAmount
  //   },
  //   {
  //     stockName: '삼성전자',
  //     stockCode: '005930',
  //     stockJu: 400,
  //     stockAver: '63,894',
  //     stockAverWon: '25,557,600',
  //     stockNow: '64,294',
  //     stockNowWon: '25,717,600',
  //     stockSu: '0.63',
  //     stockSuWon: '160,000',
  //   },
  // ];
  useEffect(() => {
    const allTrades = async (type) => {
      await tradeAPI
        .getAllTrades(type)
        .then((request) => {
          setTransaction(request.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const myStocks = async () => {
      await memberAPI
        .stocks()
        .then((request) => {
          setMyStocks(request.data);
        })
        .catch((err) => console.log(err));
    };
    allTrades();
    myStocks();
  }, []);
  const dayDay = (date) => {
    date = String(date);
    return date.slice(2, 4) + '.' + date.slice(4, 6) + '.' + date.slice(6, 8);
  };

  return (
    <div className="stock-container">
      <div className="stock-button">
        <Button
          style={{ width: '32%' }}
          color="primary"
          variant={choose === 0 ? 'contained' : 'outlined'}
          disableElevation
          onClick={() => {
            setChoose(0);
          }}
        >
          보유 주식
        </Button>
        <Button
          className="dropdown"
          style={{ width: '32%' }}
          color="primary"
          variant={choose === 1 ? 'contained' : 'outlined'}
          disableElevation
          onClick={() => {
            setChoose(1);
          }}
        >
          거래 내역
        </Button>
        <Button
          style={{ width: '32%' }}
          color="primary"
          variant={choose === 2 ? 'contained' : 'outlined'}
          disableElevation
          onClick={() => {
            setChoose(2);
          }}
        >
          거래 예정
        </Button>
      </div>
      {choose === 0 ? <HoldingStock myStocks={myStocks} /> : null}
      {choose === 1
        ? transaction.map((stock, i) => {
            return (
              <div key={i}>
                {stock.stockDealType === 'BUY' ? (
                  <TransactionBuy stock={stock} dayDay={dayDay} />
                ) : (
                  <TransactionSell stock={stock} dayDay={dayDay} />
                )}
              </div>
            );
          })
        : null}
      {/* {choose === 0 ? <Trade trade={trade} /> : null}
      {choose === 1 ? <BestIncrease increase={increases} /> : null}
      {choose === 2 ? <BestDecrease decrease={decreases} /> : null} */}
    </div>
  );
};

export default StockTrade;

const HoldingStock = (props) => {
  const stocks = props.myStocks;
  return (
    <div>
      {stocks.map((stock, i) => {
        return (
          <div className="asset-holding-main" key={i}>
            <div className="asset-holding-first">
              <span style={{ fontSize: '20px' }}>{stock.stockName}</span>
              <span>평균매수가</span>
              <span>현재가</span>
              <span>수익률</span>
            </div>
            <div className="asset-holding-second">
              <span style={{ fontSize: '20px', color: '#AAA7A7' }}>
                {stock.stockCode}
              </span>
              <span>{stock.memberStockAvgPrice.toLocaleString()}원</span>
              <span>{stock.memberStockCurPrice.toLocaleString()}원</span>
              <span>
                {(
                  (stock.memberStockCurPrice / stock.memberStockAvgPrice) *
                    100 -
                  100
                )
                  .toFixed(2)
                  .toLocaleString()}
                %
              </span>
            </div>
            <div className="asset-holding-last">
              <span style={{ fontSize: '20px' }}>
                {stock.memberStockAmount}주
              </span>
              <span>{stock.memberStockAvgPriceSum.toLocaleString()}원</span>
              <span>{stock.memberStockCurPriceSum.toLocaleString()}원</span>
              <span>
                {(
                  stock.memberStockCurPriceSum - stock.memberStockAvgPriceSum
                ).toLocaleString()}
                원
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TransactionSell = (props) => {
  //판매컴포넌트
  const stock = props.stock;
  const dayDay = props.dayDay;
  return (
    <div className="transaction-sell-container">
      <div className="transaction-sell-items">
        <div style={{ color: '#1E90FF' }}>매도완료</div>
        <div>{dayDay(stock.stockDealDate)}</div>
        <div className="transaction-sell-last">{stock.stockDealAmount}주</div>
      </div>
      <div className="transaction-sell-items">
        <div>{stock.stockName}</div>
        <div>{stock.stockCode}</div>
      </div>
      <div className="transaction-sell-items">
        <div>주당구매가</div>
        <div>{stock.stockDealSellClosingPrice.toLocaleString()}원</div>
        <div className="transaction-sell-last" style={{ color: '#1E90FF' }}>
          ▼{' '}
          {(
            stock.stockDealSellClosingPrice * stock.stockDealAmount
          ).toLocaleString()}{' '}
          원
        </div>
      </div>
    </div>
  );
};

const TransactionBuy = (props) => {
  //구매컴포넌트
  const stock = props.stock;
  const dayDay = props.dayDay;
  return (
    <div className="transaction-buy-container">
      <div className="transaction-buy-items">
        <div>{stock.stockDealAmount}주</div>
        <div className="transaction-buy-mid">{dayDay(stock.stockDealDate)}</div>
        <div className="transaction-buy-last" style={{ color: '#D2143C' }}>
          매수완료
        </div>
      </div>
      <div className="transaction-buy-items">
        <div>{stock.stockName}</div>
        <div>{stock.stockCode}</div>
      </div>
      <div className="transaction-buy-items">
        <div>주당판매가</div>
        <div>{stock.stockDealBuyClosingPrice.toLocaleString()}원</div>
        <div
          className="transaction-buy-nomid-last"
          style={{ color: '#D2143C' }}
        >
          ▲{' '}
          {(
            stock.stockDealBuyClosingPrice * stock.stockDealAmount
          ).toLocaleString()}{' '}
          원
        </div>
      </div>
    </div>
  );
};

const ExpectedTransactionSell = (props) => {
  //판매컴포넌트
  const stock = props.stock;
  const dayDay = props.dayDay;
  return (
    <div className="transaction-sell-container">
      <div className="transaction-sell-items">
        <div>매도완료</div>
        <div>{dayDay(stock.stockDealDate)}</div>
        <div className="transaction-sell-last">{stock.stockDealAmount}주</div>
      </div>
      <div className="transaction-sell-items">
        <div>{stock.stockName}</div>
        <div>{stock.stockCode}</div>
      </div>
      <div className="transaction-sell-items">
        <div>주당구매가</div>
        <div>{stock.stockDealSellClosingPrice.toLocaleString()}원</div>
        <div className="transaction-sell-last">
          {(
            stock.stockDealSellClosingPrice * stock.stockDealAmount
          ).toLocaleString()}{' '}
          원
        </div>
      </div>
    </div>
  );
};

const ExpectedTransactionBuy = (props) => {
  //구매컴포넌트
  const stock = props.data;
  return (
    <div className="transaction-buy-container">
      <div className="transaction-buy-items">
        <div>200주</div>
        <div className="transaction-buy-mid">21.01.19</div>
        <div className="transaction-buy-last">매수완료</div>
      </div>
      <div className="transaction-buy-items">
        <div>삼성전자는언젠가오를까요</div>
        <div>005930</div>
      </div>
      <div className="transaction-buy-items">
        <div>주당판매가</div>
        <div>64,294원</div>
        <div className="transaction-buy-nomid-last">6,429,400원</div>
      </div>
    </div>
  );
};
