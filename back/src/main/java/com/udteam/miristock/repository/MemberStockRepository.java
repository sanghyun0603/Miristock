package com.udteam.miristock.repository;

import com.udteam.miristock.entity.MemberStockEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MemberStockRepository extends JpaRepository<MemberStockEntity, Integer> {

    // 회원 보유 주식 전부 출력하기
    List<MemberStockEntity> findAllByMemberNo(Integer memberNo);
    
    // 회원 보유 주식 삭제하기
    int deleteByMemberNoAndStockCode(Integer memberNo, String stockCode);

    // 시뮬레이션 종료시 가장 많은 수익금과 손실금을 출력하는 쿼리문 =======
    // 위 아래 실행속도가 같음...
    @Query(nativeQuery = true,
            value = " SELECT * From memberstock as m where  " +
//            " m.memberStockAccSellPrice = (select min(m.memberStockAccSellPrice - m.memberStockAccPurchasePrice) from m) AND  " +
            "  memberstock_amount = 0 and member_no=:memberNo order by (memberstock_acc_sellprice - memberstock_acc_purchaseprice) desc limit 3 ")
    List<MemberStockEntity> findTop1ByMemberNoAndMemberStockAmountOrderByMemberStockAccEarnPriceAsc(@Param("memberNo") Integer memberNo);
//    MemberStockEntity findTop1ByMemberNoAndMemberStockAmountOrderByMemberStockAccEarnPriceAsc(Integer memberNo, Long stockAmount);
    @Query(nativeQuery = true,
            value = " SELECT * From memberstock as m where " +
//            " m.memberStockAccSellPrice = (select max(m.memberStockAccSellPrice - m.memberStockAccPurchasePrice) from  m) AND " +
            "  memberstock_amount = 0 and member_no=:memberNo order by (memberstock_acc_sellprice - memberstock_acc_purchaseprice) asc limit 3")
    List<MemberStockEntity> findTop1ByMemberNoAndMemberStockAmountOrderByMemberStockAccEarnPriceDesc(@Param("memberNo") Integer memberNo);

    // 회원의 보유 주식 가져오기
    MemberStockEntity findByMemberNoAndStockCode(Integer memberNo, String stockCode);

    // 회원의 보유 주식 가져오기 (평가금액순)
    @Query(" SELECT m, s From StockDataEntity as s " +
            " JOIN MemberStockEntity as m " +
            " on m.stockCode = s.stockCode " +
            " WHERE m.memberStockAmount > 0  AND m.memberNo=:memberNo AND s.stockDataDate=:stockDataDate order by m.memberStockAvgPrice * m.memberStockAmount desc ")
    List<Object[]> findAllMemberStockListOrderByPrice(@Param("memberNo") Integer memberNo, @Param("stockDataDate") Integer memberAssetCurrentTime);

    // 회원의 보유 주식 가져오기 (수익률 순)
    @Query(" SELECT m, s From StockDataEntity as s " +
            " JOIN MemberStockEntity as m " +
            " on m.stockCode = s.stockCode " +
            " WHERE m.memberStockAmount > 0  AND m.memberNo=:memberNo AND s.stockDataDate=:stockDataDate order by s.stockDataClosingPrice/m.memberStockAvgPrice*100-100 ")
    List<Object[]> findAllMemberStockListOrderByEarnRate(@Param("memberNo") Integer memberNo, @Param("stockDataDate") Integer memberAssetCurrentTime);

    @Query(" SELECT m, s From StockDataEntity as s " +
            " JOIN MemberStockEntity as m " +
            " on m.stockCode = s.stockCode " +
            " WHERE m.memberStockAmount > 0  AND m.memberNo=:memberNo AND s.stockDataDate=:stockDataDate")
    List<Object[]> findAllMemberStockList(@Param("memberNo") Integer memberNo, @Param("stockDataDate") Integer memberAssetCurrentTime);


    // 회원의 보유 주식 단건 검색
    @Query(" SELECT m, s From StockDataEntity as s " +
            " JOIN MemberStockEntity as m " +
            " on m.stockCode = s.stockCode " +
            " WHERE m.memberStockAmount > 0  AND m.memberNo=:memberNo AND s.stockDataDate=:stockDataDate AND m.stockCode=:stockCode")
    List<Object[]> findOneMemberStock(@Param("memberNo") Integer memberNo, @Param("stockDataDate") Integer memberAssetCurrentTime, @Param("stockCode") String stockCode);

    void deleteAllByMemberNo(Integer memberNo);
}
