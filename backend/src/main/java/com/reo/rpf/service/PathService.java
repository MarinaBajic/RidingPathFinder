package com.reo.rpf.service;

import com.reo.rpf.dto.GeoJson;
import com.reo.rpf.dto.GeoJsonFeature;
import com.reo.rpf.model.Path;
import com.reo.rpf.model.PathSegment;
import com.reo.rpf.repository.PathRepository;
import com.reo.rpf.repository.PathSegmentRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.MultiLineString;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class PathService {

    private final PathRepository pathRepository;
    private final PathSegmentRepository pathSegmentRepository;

    public Optional<Path> get(Integer id) {
        return pathRepository.findById(id);
    }

    public GeoJson get() {
        List<PathSegment> pathSegments = pathSegmentRepository.findAll();

        List<GeoJsonFeature> features = pathSegments.stream()
                .filter(pathSegment -> pathSegment.getGeom() != null)
                .map(this::createGeoJsonFeature)
                .toList();

        return new GeoJson("FeatureCollection", features);
    }

    private GeoJsonFeature createGeoJsonFeature(PathSegment pathSegment) {
         MultiLineString geom = pathSegment.getGeom();
        List<List<List<Double>>> coordinates = new ArrayList<>();

        for (int i = 0; i < geom.getNumGeometries(); i++) {
            LineString lineString = (LineString) geom.getGeometryN(i);
            List<List<Double>> lineCoordinates = Arrays.stream(lineString.getCoordinates())
                    .map(coordinate -> List.of(coordinate.x, coordinate.y))
                    .toList();

            coordinates.add(lineCoordinates);
        }

        Map<String, Object> geometry = Map.of(
                "type", "MultiLineString",
                "coordinates", coordinates
        );

        Map<String, Object> properties = Map.of(
                "name", pathSegment.getName() != null ? pathSegment.getName() : "Unknown Road",
                "path_id", pathSegment.getPath().getId(),
                "road_id", pathSegment.getRoadId()
        );

        return new GeoJsonFeature("Feature", geometry, properties);
    }
}
