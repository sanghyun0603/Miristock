package com.udteam.miristock.repository;

import com.udteam.miristock.entity.StockDealEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockDealRepository  extends JpaRepository<StockDealEntity, Integer> {

    // 쿼리 성능 향상해야함 (단건삭제발생)
    int deleteAllByMemberNo(Integer memberNo);

}
