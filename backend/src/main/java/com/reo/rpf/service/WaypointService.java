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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WaypointService {

    private final WaypointRepository waypointRepository;

    public GeoJson getNearbyFromPath(Integer pathId) {
        List<Waypoint> nearbyWaypoints = waypointRepository.findNearbyFromPath(pathId);

        List<GeoJsonFeature> features = nearbyWaypoints.stream()
                .map(this::createGeoJsonFeature)
                .toList();

        return new GeoJson("FeatureCollection", features);
    }

    public GeoJson getNearbyFromRoad(Integer roadId) {
        List<Waypoint> nearbyWaypoints = waypointRepository.findNearbyFromRoad(roadId);

        List<GeoJsonFeature> features = nearbyWaypoints.stream()
                .map(this::createGeoJsonFeature)
                .toList();

        return new GeoJson("FeatureCollection", features);
    }

    public GeoJson getNearbyFromLocation(Double lat, Double lng, Double radius) {
        List<Waypoint> nearbyWaypoints = waypointRepository.findNearbyFromLocation(lat, lng, radius);

        List<GeoJsonFeature> features = nearbyWaypoints.stream()
                .map(this::createGeoJsonFeature)
                .toList();

        return new GeoJson("FeatureCollection", features);
    }

    public GeoJson getNearbyFromWaypoint(Integer id, Double radius) {
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

//    public WaypointResponse getEntity(Integer id) {
//        Optional<Waypoint> waypointOptional = waypointRepository.findById(id);
//        if (waypointOptional.isEmpty()) {
//            return null;
//        }
//        Waypoint waypoint = waypointOptional.get();
//        return new WaypointResponse(waypoint.getId(), waypoint.getName(), waypoint.getFclass(), waypoint.getGeom().getY(), waypoint.getGeom().getX());
//    }

    public WaypointResponse create(WaypointRequest waypointRequest) {
        Point location = new GeometryFactory().createPoint(new Coordinate(waypointRequest.longitude(), waypointRequest.latitude()));

        Waypoint waypoint = new Waypoint();
        waypoint.setName(waypointRequest.name());
        waypoint.setFclass(waypointRequest.fclass());
        waypoint.setGeom(location);

        Waypoint saved = waypointRepository.save(waypoint);
        return new WaypointResponse(saved.getId(), saved.getName(), saved.getFclass(), saved.getGeom().getX(), saved.getGeom().getY());
    }

    public GeoJson get(Double minLng, Double minLat, Double maxLng, Double maxLat, Integer zoom) {
        List<String> waypointClasses = getWaypointClasses(zoom);
        List<Waypoint> waypoints = waypointRepository.findWaypointsInBoundsWithClasses(minLng, minLat, maxLng, maxLat, waypointClasses);

        List<GeoJsonFeature> features = waypoints.stream()
                .map(this::createGeoJsonFeature)
                .toList();

        return new GeoJson("FeatureCollection", features);
    }

    private List<String> getWaypointClasses(Integer zoom) {
        List<String> waypointClasses = new ArrayList<>();
        if (zoom > 6) {
            waypointClasses.add("monument");
        }
        if (zoom > 8) {
            waypointClasses.add("viewpoint");
            waypointClasses.add("park");
        }
        if (zoom > 12) {
            waypointClasses.add("drinking_water");
        }
        return waypointClasses;
    }

    private GeoJsonFeature createGeoJsonFeature(Waypoint waypoint) {
        Map<String, Object> geometry = Map.of(
                "type", "Point",
                "coordinates", List.of(
                        waypoint.getGeom().getX(),
                        waypoint.getGeom().getY()
                )
        );

        Map<String, Object> properties = Map.of(
                "id", waypoint.getId(),
                "name", waypoint.getName() != null ? waypoint.getName() : waypoint.getFclass(),
                "fclass", waypoint.getFclass()
        );

        return new GeoJsonFeature("Feature", geometry, properties);
    }
}
