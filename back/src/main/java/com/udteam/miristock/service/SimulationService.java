package com.udteam.miristock.service;

import com.udteam.miristock.config.ValueConfig;
import com.udteam.miristock.dto.*;
import com.udteam.miristock.entity.*;
import com.udteam.miristock.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SimulationService {
    private final MemberAssetRepository memberAssetRepository;
    private final MemberStockRepository memberStockRepository;
    private final LimitPriceOrderRepository limitPriceOrderRepository;
    private final StockDealRepository stockDealRepository;

    @Transactional
    public SimulEndDto resultSimulation(Integer memberNo){
        log.info("시뮬레이션 resultSimulation 진입");
        // 회원자산 불러오기
        MemberAssetEntity memberAssetEntity = memberAssetRepository.findById(memberNo).get();
        log.info("회원 자산 불러오기 memberAssetEntity : {}",memberAssetEntity);

        // 매수 예정 내역들 전부 취소하기(삭제)
//        limitPriceOrderRepository.deleteAllByMemberNoAndLimitPriceOrderType(memberNo, Deal.BUY);
        
        // 매수, 매도 전부 취소하기
        limitPriceOrderRepository.deleteAllByMemberNo(memberNo);
        
        // 매도 예정 내역들 불러오기
        // List<Object[]> limitPriceOrderListSELL = limitPriceOrderRepository.compareLimitPriceOrderWithTodayStockData(memberNo, memberAssetEntity.getMemberassetCurrentTime(), Deal.SELL);

        // 보유 주식 목록 + 주식 데이터 같이 들고오기
        List<Object[]> memberStockListOrderByPrice = memberStockRepository.findAllMemberStockListOrderByPrice(memberNo, memberAssetEntity.getMemberassetCurrentTime());
        // 현재가로 팔아버리기
        
        Long purchaseStockPriceSum = 0L; // 처음 주식 구입 금액 합
        Long sellStockPriceSum = 0L; // 팔때 주식 금액 합

        // 보유 주식 목록에서 수익률 계산하기
        for (Object[] objects : memberStockListOrderByPrice) {
            MemberStockEntity memberStockEntity = (MemberStockEntity) objects[0];
            StockDataEntity stockDataEntity = (StockDataEntity) objects[1];

            // 회원 보유 주식 량
            Long memberStockAmount = memberStockEntity.getMemberStockAmount();
            // 해당 주식 종가
            Long stockClosingPrice = stockDataEntity.getStockDataClosingPrice();
            // 해당 보유 주식 평균 가치 금액 (구입금액)
            Long purchasePrice = memberStockEntity.getMemberStockAccPurchasePrice();

            // 해당 주식 강제 판매금액 -> 해당주식 종가 X 회원 보유 주식량
            Long sellClosingPriceAmount = memberStockAmount * stockClosingPrice;
            // 총 판매 금액에 반영하기
            sellStockPriceSum += sellClosingPriceAmount;

            // 해당 주식 구입 총 구입 금액
            Long purchasePriceAmount = purchasePrice * memberStockAmount;
            // 총 구입 금액에 반영하기
            purchaseStockPriceSum += purchasePriceAmount;

//            Long sellPriceSum = memberStockEntity.getMemberStockAccSellPrice() + sellClosingPriceAmount;

            // 처음 주식 구입가 X 가지고 있는 주식 보유량 => 주식 자산가격
            Long memStockPrice = memberStockEntity.getMemberStockAvgPrice() * memberStockAmount;
            // 종가 X  주식 보유량 -> 강제판매가격


//            purchaseStockPriceSum += memStockPrice;
//            sellStockPriceSum += curStockPrice;

            // 해당 주식 목록의 수익률, 수익금도 반영해야함...
            // 회원 보유 주식에 업데이트
            memberStockRepository.save(MemberStockEntity.builder()
                    .memberStockNo(memberStockEntity.getMemberStockNo())
                    .stockCode(memberStockEntity.getStockCode())
                    .stockName(memberStockEntity.getStockName())
                    .memberNo(memberStockEntity.getMemberNo())
                    .memberStockAmount(0L)
                    .memberStockAvgPrice(0L)
                    .memberStockAccPurchasePrice(memberStockEntity.getMemberStockAccPurchasePrice())
                    .memberStockAccSellPrice(memberStockEntity.getMemberStockAccSellPrice() + sellClosingPriceAmount)
//                    .memberStockAccEarnRate(
//                            memberStockEntity.getMemberStockAccPurchasePrice()
//                            / (memberStockEntity.getMemberStockAccSellPrice() + sellClosingPriceAmount)
//                                    * (float)100 - (float)100)
                            .memberStockAccEarnRate(  (float)((sellClosingPriceAmount - purchasePriceAmount) / purchasePriceAmount) * 100   )
                    .build()
            );

        }

        // 매도 예정 내역들 전부 취소하기(삭제)
//        limitPriceOrderRepository.deleteAllByMemberNoAndLimitPriceOrderType(memberNo, Deal.SELL);

        // 회원 자산 업데이트
        memberAssetRepository.save(MemberAssetEntity.builder()
                        .memberassetNo(memberAssetEntity.getMemberassetNo())
                        .member(memberAssetEntity.getMember())
                        .memberassetTotalAsset(memberAssetEntity.getMemberassetTotalAsset() + sellStockPriceSum)
                        .memberassetAvailableAsset(memberAssetEntity.getMemberassetAvailableAsset() + sellStockPriceSum)
                        .memberassetStockAsset(memberAssetEntity.getMemberassetStockAsset() - purchaseStockPriceSum)
                        .memberassetLastTotalAsset(memberAssetEntity.getMemberassetLastTotalAsset())
                        .memberassetCurrentTime(memberAssetEntity.getMemberassetCurrentTime())
                        .build());

        try{
            MemberStockEntity low =  memberStockRepository.findTop1ByMemberNoAndMemberStockAmountOrderByMemberStockAccEarnPriceDesc(memberNo, 0L).get(0);
            MemberStockEntity high = memberStockRepository.findTop1ByMemberNoAndMemberStockAmountOrderByMemberStockAccEarnPriceAsc(memberNo, 0L).get(0);
        } catch (Exception e){
            log.info("사고 판 주식이 없음");
            return new SimulEndDto(memberAssetEntity,null,null );
        }
        
        // 결과 데이터 출력
        return new SimulEndDto(
                memberAssetEntity,
                new MemberSimulEndDto(memberStockRepository.findTop1ByMemberNoAndMemberStockAmountOrderByMemberStockAccEarnPriceDesc(memberNo, 0L).get(0)),
                new MemberSimulEndDto(memberStockRepository.findTop1ByMemberNoAndMemberStockAmountOrderByMemberStockAccEarnPriceAsc(memberNo, 0L).get(0))
                );
    }

    // 시뮬레이션 종료...
    @Transactional
    public void resetSimulation(MemberDto memberDto){
        // 회원 자산 기본으로 초기화
        MemberAssetEntity memberAssetResetResult  = memberAssetRepository.save(MemberAssetEntity.builder()
                        .memberassetNo(memberDto.getMemberNo())
                        .member(MemberEntity.builder().memberNo(memberDto.getMemberNo()).build())
                        .memberassetAvailableAsset(ValueConfig.memberInitAvailableAsset)
                        .memberassetStockAsset(0L)
                        .memberassetTotalAsset(ValueConfig.memberInitAvailableAsset)
                        .memberassetCurrentTime(ValueConfig.memberInitSimulationTime)
                        .memberassetLastTotalAsset(ValueConfig.memberInitAvailableAsset)
                        .build());

        // 거래예정 테이블 삭제
        limitPriceOrderRepository.deleteByMemberNo(memberDto.getMemberNo());

        // 회원 보유 주식 테이블 삭제
        memberStockRepository.deleteByMemberNo(memberDto.getMemberNo());

        // 회원 주식 거래 내역 테이블 삭제
        stockDealRepository.deleteAllByMemberNo(memberDto.getMemberNo());

    }

}
