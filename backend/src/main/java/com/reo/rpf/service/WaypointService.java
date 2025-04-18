package com.reo.rpf.service;

import com.reo.rpf.dto.GeoJson;
import com.reo.rpf.dto.GeoJsonFeature;
import com.reo.rpf.dto.WaypointRequest;
import com.reo.rpf.dto.WaypointResponse;
import com.reo.rpf.model.Waypoint;
import com.reo.rpf.repository.WaypointRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WaypointService {

    private final WaypointRepository waypointRepository;

    public GeoJson getNearbyFromLocation(double lat, double lng, double radius) {
        List<Waypoint> nearbyWaypoints = waypointRepository.findNearbyFromLocation(lat, lng, radius);

        List<GeoJsonFeature> features = nearbyWaypoints.stream()
                .map(this::createGeoJsonFeature)
                .toList();

        return new GeoJson("FeatureCollection", features);
    }

    public GeoJson getNearbyFromWaypoint(Integer id, double radius) {
        List<Waypoint> nearbyWaypoints = waypointRepository.findNearbyFromWaypoint(id, radius);

        List<GeoJsonFeature> features = nearbyWaypoints.stream()
                .map(this::createGeoJsonFeature)
                .toList();

        return new GeoJson("FeatureCollection", features);
    }

    public boolean delete(Integer id) {
        Optional<Waypoint> waypointOptional = waypointRepository.findById(id);
        if (waypointOptional.isEmpty()) {
            return false;
        }
        Waypoint waypoint = waypointOptional.get();
        waypointRepository.delete(waypoint);
        return true;
    }

    public WaypointResponse getEntity(Integer id) {
        Optional<Waypoint> waypointOptional = waypointRepository.findById(id);
        if (waypointOptional.isEmpty()) {
            return null;
        }
        Waypoint waypoint = waypointOptional.get();
        return new WaypointResponse(waypoint.getId(), waypoint.getName(), waypoint.getDescription(), waypoint.getLocation().getX(), waypoint.getLocation().getY());
    }

    public WaypointResponse create(WaypointRequest waypointRequest) {
        Point location = new GeometryFactory().createPoint(new Coordinate(waypointRequest.latitude(), waypointRequest.longitude()));

        Waypoint waypoint = new Waypoint();
        waypoint.setName(waypointRequest.name());
        waypoint.setDescription(waypointRequest.description());
        waypoint.setLocation(location);

        Waypoint saved = waypointRepository.save(waypoint);
        return new WaypointResponse(saved.getId(), saved.getName(), saved.getDescription(), saved.getLocation().getX(), saved.getLocation().getY());
    }

    public GeoJson get() {
        List<Waypoint> waypoints = waypointRepository.findAll();

        List<GeoJsonFeature> features = waypoints.stream()
                .map(this::createGeoJsonFeature)
                .toList();

        return new GeoJson("FeatureCollection", features);
    }

    private GeoJsonFeature createGeoJsonFeature(Waypoint waypoint) {
        Map<String, Object> geometry = Map.of(
                "type", "Point",
                "coordinates", List.of(
                        waypoint.getLocation().getY(),
                        waypoint.getLocation().getX()
                )
        );

        Map<String, Object> properties = Map.of(
                "id", waypoint.getId(),
                "name", waypoint.getName(),
                "description", waypoint.getDescription()
        );

        return new GeoJsonFeature("Feature", geometry, properties);
    }
}
