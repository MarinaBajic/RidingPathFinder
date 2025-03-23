package com.reo.rpf.controller;

import com.reo.rpf.model.Waypoint;
import com.reo.rpf.service.WaypointService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class WaypointController {

    private final WaypointService waypointService;

    @GetMapping("/waypoints")
    public ResponseEntity<Map<String, Object>> getWaypoints() {
        List<Waypoint> waypoints = waypointService.getWaypoints();

        List<Map<String, Object>> features = waypoints.stream().map(waypoint -> {
            // Build GeoJSON feature
            Map<String, Object> feature = new HashMap<>();

            Map<String, Object> geometry = new HashMap<>();
            geometry.put("type", "Point");
            geometry.put("coordinates", new double[] {
                    waypoint.getLocation().getY(), // [longitude, latitude]
                    waypoint.getLocation().getX()
            });

            Map<String, Object> properties = new HashMap<>();
            properties.put("name", waypoint.getName());
            properties.put("description", waypoint.getDescription());

            feature.put("type", "Feature");
            feature.put("geometry", geometry);
            feature.put("properties", properties);

            return feature;
        }).collect(Collectors.toList());

        // Create GeoJSON FeatureCollection
        Map<String, Object> geoJson = new HashMap<>();
        geoJson.put("type", "FeatureCollection");
        geoJson.put("features", features);

        return ResponseEntity.ok(geoJson); // Return the GeoJSON structure
    }
}
