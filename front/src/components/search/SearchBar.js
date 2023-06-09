import { TextField } from '@mui/material';
import { AiOutlineSearch } from 'react-icons/ai';
import SearchView from './SearchView';
import History from './History';
import { searchAPI } from '../../api/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/SearchBar.css';

// 키워드, 결과값들, 업데이트필드를 전달받는다
const SearchBar = () => {
  //최근검색기록
  const [searchResult, setSearchResult] = useState([]);
  // 하단 조건부렌더링 bool 체크
  const [isCheck, setIsCheck] = useState(true);
  const navigate = useNavigate();
  // onChange를 사용하여 글자를 입력할때마다 updateField호출, renderResults 렌더링.
  return (
    <div className="search-bar">
      <div className="search-top">
        <AiOutlineSearch size={40} />
        <div className="text-field">
          {/* 검색 textfield */}
          <TextField
            sx={{ width: { xs: 300, sm: 540, md: 720, lg: 960, xl: 1140 } }}
            id="search-bar"
            placeholder="종목명 또는 종목코드 입력"
            variant="standard"
            onChange={(e) => {
              searchAPI
                .serachStock(e.target.value)
                .then((request) => {
                  // 검색어O -> 결과 출력, 검색어X 검색 결과 초기화
                  setSearchResult(request.data);
                  // console.log(request.data);
                })
                .catch((err) => console.log(err));
              if (e.target.value.length > 0) {
                setIsCheck(false);
              } else {
                setIsCheck(true);
              }
            }}
          />
        </div>
      </div>

      {/* 종목 검색 결과  스트링반환값은 해주지마세요 제발*/}

      {isCheck === true ? (
        <History />
      ) : searchResult.length >= 1 && typeof searchResult !== 'string' ? (
        searchResult.map((stock, i) => {
          return (
            <div
              key={i}
              onClick={() => {
                searchAPI
                  .createSearchHis(stock.stockName, stock.stockCode)
                  .then((request) => {})
                  .catch((err) => console.log(err));
                navigate(`/stock/${stock.stockCode}`, {
                  state: { stockName: stock.stockName },
                });
              }}
            >
              <SearchView
                name={stock.stockName}
                code={stock.stockCode}
                key={stock.stockCode}
              />
            </div>
          );
        })
      ) : null}
    </div>
  );
};

export default SearchBar;
