package com.reo.rpf.controller;

import com.reo.rpf.dto.GeoJson;
import com.reo.rpf.service.PoiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/pois")
public class PoiController {

    private final PoiService poiService;

    @GetMapping
    public ResponseEntity<GeoJson> get(@RequestParam Double minLng,
                                       @RequestParam Double minLat,
                                       @RequestParam Double maxLng,
                                       @RequestParam Double maxLat,
                                       @RequestParam Integer zoom) {
        return ResponseEntity.ok(poiService.get(minLng, minLat, maxLng, maxLat, zoom));
    }
}
