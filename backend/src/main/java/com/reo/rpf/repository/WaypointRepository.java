package com.reo.rpf.repository;

import com.reo.rpf.model.Waypoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WaypointRepository extends JpaRepository<Waypoint, Integer> {

    @Query(value = """
    SELECT DISTINCT w.*
    FROM waypoint w
    JOIN path_segment ps ON ST_DWithin(
        w.geom,
        ps.geom,
        0.0009)
    WHERE ps.path_id = :pathId
    """, nativeQuery = true)
    List<Waypoint> findNearbyFromPath(@Param("pathId") Integer pathId);

    @Query(value = """
    SELECT * FROM waypoint w
    WHERE ST_DWithin(
        w.geom::geography,
        (SELECT geom FROM road WHERE id = :roadId)::geography,
         100)
    """, nativeQuery = true)
    List<Waypoint> findNearbyFromRoad(@Param("roadId") Integer roadId);

    @Query(value = """
    SELECT * FROM waypoint w
    WHERE ST_DWithin(
        w.geom::geography,
        (SELECT geom FROM waypoint WHERE id = :id)::geography,
        :radius
    )
    AND w.id != :id
    """, nativeQuery = true)
    List<Waypoint> findNearbyFromWaypoint(@Param("id") Integer id, @Param("radius") double radius);

    @Query(value = """
    SELECT * FROM waypoint w
    WHERE ST_DWithin(
        w.geom::geography,
        ST_SetSRID(ST_MakePoint(:lat, :lng), 4326)::geography,
        :radius
    )
""", nativeQuery = true)
    List<Waypoint> findNearbyFromLocation(@Param("lat") Double lat, @Param("lng") Double lng, @Param("radius") Double radius);

    @Query("SELECT w FROM Waypoint w WHERE " +
            "ST_Within(w.geom, ST_MakeEnvelope(:minLng, :minLat, :maxLng, :maxLat, 4326)) " +
            "AND (:waypointClassFilter IS NULL OR w.fclass IN :waypointClassFilter)")
    List<Waypoint> findWaypointsInBoundsWithClasses(Double minLng, Double minLat, Double maxLng, Double maxLat,
                                                    @Param("waypointClassFilter") List<String> waypointClassFilter);
}