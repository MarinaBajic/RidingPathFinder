package com.reo.rpf.controller;

import com.reo.rpf.dto.GeoJson;
import com.reo.rpf.dto.WaypointRequest;
import com.reo.rpf.dto.WaypointResponse;
import com.reo.rpf.service.WaypointService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/waypoints")
public class WaypointController {

    private final WaypointService waypointService;


    @GetMapping("/nearby-path")
    public ResponseEntity<GeoJson> getNearbyFromPath(@RequestParam Integer pathId) {
        return ResponseEntity.ok(waypointService.getNearbyFromPath(pathId));
    }

//    @GetMapping("/nearby")
//    public ResponseEntity<GeoJson> getNearbyFromLocation(
//            @RequestParam Double lat,
//            @RequestParam Double lng,
//            @RequestParam Double radius
//    ) {
//        return ResponseEntity.ok(waypointService.getNearbyFromLocation(lat, lng, radius));
//    }

    @GetMapping("/{id}/nearby")
    public ResponseEntity<GeoJson> getNearbyFromWaypoint(
            @PathVariable Integer id,
            @RequestParam Double radius
    ) {
        return ResponseEntity.ok(waypointService.getNearbyFromWaypoint(id, radius));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable Integer id) {
        boolean deleted = waypointService.delete(id);
        if (deleted) {
            return new ResponseEntity<>(true, HttpStatus.OK);
        }
        return new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<WaypointResponse> create(@RequestBody WaypointRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(waypointService.create(dto));
    }

    @GetMapping
    public ResponseEntity<GeoJson> get(@RequestParam Double minLng,
                                       @RequestParam Double minLat,
                                       @RequestParam Double maxLng,
                                       @RequestParam Double maxLat,
                                       @RequestParam Integer zoom) {
        return ResponseEntity.ok(waypointService.get(minLng, minLat, maxLng, maxLat, zoom));
    }
}
