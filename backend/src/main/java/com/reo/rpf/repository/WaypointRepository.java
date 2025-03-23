package com.reo.rpf.repository;

import com.reo.rpf.model.Waypoint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WaypointRepository extends JpaRepository<Waypoint, Integer> {
}