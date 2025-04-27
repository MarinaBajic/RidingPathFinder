package com.reo.rpf.controller;

import com.reo.rpf.dto.GeoJson;
import com.reo.rpf.service.RoadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/roads")
public class RoadController {

    private final RoadService roadService;

    @GetMapping("/path")
    public ResponseEntity<GeoJson> getPath(@RequestParam double minLng,
                                           @RequestParam double minLat,
                                           @RequestParam double maxLng,
                                           @RequestParam double maxLat,
                                           @RequestParam Integer startId,
                                           @RequestParam Integer endId) {
        return ResponseEntity.ok(roadService.findPathBetweenWaypoints(minLng, minLat, maxLng, maxLat, startId, endId));
    }

    @GetMapping
    public ResponseEntity<GeoJson> get(@RequestParam double minLng,
                                       @RequestParam double minLat,
                                       @RequestParam double maxLng,
                                       @RequestParam double maxLat,
                                       @RequestParam int zoom) {
        return ResponseEntity.ok(roadService.get(minLng, minLat, maxLng, maxLat, zoom));
    }
}
