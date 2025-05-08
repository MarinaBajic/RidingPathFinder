package com.reo.rpf.service;

import com.reo.rpf.dto.GeoJson;
import com.reo.rpf.dto.GeoJsonFeature;
import com.reo.rpf.model.Road;
import com.reo.rpf.model.Waypoint;
import com.reo.rpf.repository.RoadRepository;
import com.reo.rpf.repository.WaypointRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.MultiLineString;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RoadService {

    private final RoadRepository roadRepository;
    private final WaypointRepository waypointRepository;

    public GeoJson findPathBetweenWaypoints(double minLng, double minLat, double maxLng, double maxLat, Integer startWaypointId, Integer endWaypointId) {
        Waypoint start = waypointRepository.findById(startWaypointId)
                .orElseThrow(() -> new RuntimeException("Start waypoint not found"));
        Waypoint end = waypointRepository.findById(endWaypointId)
                .orElseThrow(() -> new RuntimeException("End waypoint not found"));

        Road startRoad = roadRepository.findNearestRoad(minLng, minLat, maxLng, maxLat, start.getGeom());
        Road endRoad = roadRepository.findNearestRoad(minLng, minLat, maxLng, maxLat, end.getGeom());

//        List<Road> roads = roadRepository.findPathBetweenNodes(startRoad.getTarget(), endRoad.getSource());
        List<Road> roads = List.of(startRoad, endRoad);

        List<GeoJsonFeature> features = roads.stream()
                .filter(road -> road.getGeom() != null)
                .map(this::createGeoJsonFeature)
                .toList();

        return new GeoJson("FeatureCollection", features);
    }

    public GeoJson get(Double minLng, Double minLat, Double maxLng, Double maxLat, Integer zoom) {
        List<String> roadClasses = getRoadClasses(zoom);
        List<Road> roads = roadRepository.findRoadsInBoundsWithClasses(minLng, minLat, maxLng, maxLat, roadClasses);

        List<GeoJsonFeature> features = roads.stream()
                .filter(road -> road.getGeom() != null)
                .map(this::createGeoJsonFeature)
                .toList();

        return new GeoJson("FeatureCollection", features);
    }

    private List<String> getRoadClasses(Integer zoom) {
        List<String> roadClasses = new ArrayList<>();
        if (zoom > 6) {
            roadClasses.add("motorway");
            roadClasses.add("motorway_link");
            roadClasses.add("trunk");
            roadClasses.add("trunk_link");
        }
        if (zoom > 8) {
            roadClasses.add("primary");
            roadClasses.add("primary_link");
        }
        if (zoom > 12) {
            roadClasses.add("secondary");
            roadClasses.add("secondary_link");
        }
        if (zoom > 14) {
            roadClasses.add("tertiary");
            roadClasses.add("tertiary_link");
        }
        if (zoom > 15) {
            roadClasses.add("residential");
            roadClasses.add("service");
        }
        if (zoom > 16) {
            roadClasses.add("cycleway");
            roadClasses.add("footway");
            roadClasses.add("living_street");
            roadClasses.add("pedestrian");
            roadClasses.add("track");
            roadClasses.add("track_grade1");
            roadClasses.add("track_grade2");
            roadClasses.add("track_grade3");
            roadClasses.add("track_grade4");
            roadClasses.add("track_grade5");
            roadClasses.add("path");
            roadClasses.add("bridleway");
            roadClasses.add("steps");
            roadClasses.add("unclassified");
            roadClasses.add("unknown");
        }
        return roadClasses;
    }

    private GeoJsonFeature createGeoJsonFeature(Road road) {
        MultiLineString geom = road.getGeom();
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
                "name", road.getName() != null ? road.getName() : "Unknown Road"
        );

        return new GeoJsonFeature("Feature", geometry, properties);
    }

}
