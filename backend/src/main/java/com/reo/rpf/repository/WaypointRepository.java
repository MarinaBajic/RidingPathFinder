package com.reo.rpf.repository;

import com.reo.rpf.model.Waypoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WaypointRepository extends JpaRepository<Waypoint, Integer> {

    @Query(value = """
    SELECT * FROM waypoint w
    WHERE ST_DWithin(
        w.location::geography,
        (SELECT location FROM waypoint WHERE id = :id)::geography,
        :radius
    )
""", nativeQuery = true)
    List<Waypoint> findNearby(@Param("id") Integer id, @Param("radius") double radius);

}