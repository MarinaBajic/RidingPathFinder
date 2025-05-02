package com.reo.rpf.repository;

import com.reo.rpf.model.Poi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PoiRepository extends JpaRepository<Poi, Integer> {

    @Query("SELECT p FROM Poi p WHERE " +
            "ST_Within(p.geom, ST_MakeEnvelope(:minLng, :minLat, :maxLng, :maxLat, 4326)) " +
            "AND (:poiClassFilter IS NULL OR p.fclass IN :poiClassFilter)")
    List<Poi> findPoisInBoundsWithClasses(Double minLng, Double minLat, Double maxLng, Double maxLat, @Param("poiClassFilter") List<String> poiClassFilter);
}