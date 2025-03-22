package com.reo.rpf.controller;

import com.reo.rpf.model.Road;
import com.reo.rpf.service.PathService;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.MultiLineString;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class PathController {

    private final PathService pathService;

    @GetMapping("/roads")
    public ResponseEntity<Map<String, Object>> getRoads(@RequestParam double minLng,
                                                        @RequestParam double minLat,
                                                        @RequestParam double maxLng,
                                                        @RequestParam double maxLat,
                                                        @RequestParam int zoom) {
        List<Road> roads = pathService.getRoads(minLng, minLat, maxLng, maxLat, zoom);

        List<Map<String, Object>> features = roads.stream()
                .filter(road -> road.getGeom() != null)
                .map(this::createGeoJsonFeature)
                .toList();

        Map<String, Object> geoJson = Map.of(
                "type", "FeatureCollection",
                "features", features
        );


        return ResponseEntity.ok(geoJson);
    }

    private Map<String, Object> createGeoJsonFeature(Road road) {
        MultiLineString multiLineString = road.getGeom();
        List<List<List<Double>>> coordinates = new ArrayList<>();

        for (int i = 0; i < multiLineString.getNumGeometries(); i++) {
            LineString lineString = (LineString) multiLineString.getGeometryN(i);
            List<List<Double>> lineCoordinates = Arrays.stream(lineString.getCoordinates())
                    .map(coordinate -> List.of(coordinate.x, coordinate.y))
                    .collect(Collectors.toList());

            coordinates.add(lineCoordinates);
        }

        return Map.of(
                "type", "Feature",
                "geometry", Map.of(
                        "type", "MultiLineString",
                        "coordinates", coordinates
                ),
                "properties", Map.of("name", road.getName() != null ? road.getName() : "Unknown Road")
        );
    }
}
