package com.reo.rpf.service;

import com.reo.rpf.dto.GeoJson;
import com.reo.rpf.dto.GeoJsonFeature;
import com.reo.rpf.dto.WaypointDto;
import com.reo.rpf.model.Waypoint;
import com.reo.rpf.repository.WaypointRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WaypointService {

    private final WaypointRepository waypointRepository;

    public WaypointDto addWaypoint(WaypointDto waypointDto) {
        Point location = new GeometryFactory().createPoint(new Coordinate(waypointDto.latitude(), waypointDto.longitude()));

        Waypoint waypoint = new Waypoint();
        waypoint.setName(waypointDto.name());
        waypoint.setDescription(waypointDto.description());
        waypoint.setLocation(location);

        Waypoint saved = waypointRepository.save(waypoint);
        return new WaypointDto(saved.getName(), saved.getDescription(), saved.getLocation().getX(), saved.getLocation().getY());
    }

    public GeoJson getWaypoints() {
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
                "name", waypoint.getName(),
                "description", waypoint.getDescription()
        );

        return new GeoJsonFeature("Feature", geometry, properties);
    }
}
