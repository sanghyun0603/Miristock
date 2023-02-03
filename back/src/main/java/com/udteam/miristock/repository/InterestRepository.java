package com.udteam.miristock.repository;

import com.udteam.miristock.entity.InterestEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterestRepository extends JpaRepository<InterestEntity,Integer> {
    void deleteByMember_MemberNoAndStock_StockCode(Integer id, String stockCode);
}