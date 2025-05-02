package com.reo.rpf.repository;

import com.reo.rpf.model.Road;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RoadRepository extends JpaRepository<Road, Integer> {

    @Query(value = """
    SELECT r.* FROM pgr_dijkstra(
        'SELECT id, source, target, ST_Length(geom::geography) AS cost FROM road',
        :sourceNode, :targetNode, false
    ) AS path
    JOIN road r ON path.edge = r.id
    ORDER BY path.seq
    """, nativeQuery = true)
    List<Road> findPathBetweenNodes(@Param("sourceNode") int sourceNode, @Param("targetNode") int targetNode);

    @Query("SELECT r FROM Road r WHERE " +
            "ST_Within(r.geom, ST_MakeEnvelope(:minLng, :minLat, :maxLng, :maxLat, 4326)) " +
            "ORDER BY distance(r.geom, :location) ASC")
    List<Road> findNearestRoad(Double minLng, Double minLat, Double maxLng, Double maxLat, @Param("location") Point location);

    //This query fetches all roads that intersect with a given geometry (:geom). For example, if you pass a bounding box or a specific area as geom, it will return all roads within that area.
    @Query("SELECT r FROM Road r WHERE ST_Intersects(r.geom, :geom) = true")
    List<Road> findIntersecting(@Param("geom") Geometry geom);

    @Query("SELECT r FROM Road r WHERE " +
            "ST_Within(r.geom, ST_MakeEnvelope(:minLng, :minLat, :maxLng, :maxLat, 4326)) " +
            "AND (:roadClassFilter IS NULL OR r.fclass IN :roadClassFilter)")
    List<Road> findRoadsInBoundsWithClasses(Double minLng, Double minLat, Double maxLng, Double maxLat, @Param("roadClassFilter") List<String> roadClassFilter);

}