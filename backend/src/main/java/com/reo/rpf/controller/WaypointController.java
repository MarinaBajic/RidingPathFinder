package com.reo.rpf.controller;

import com.reo.rpf.dto.GeoJson;
import com.reo.rpf.dto.WaypointDto;
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

    @GetMapping("/{id}")
    public ResponseEntity<WaypointDto> getWaypoint(@PathVariable Integer id) {
        WaypointDto waypointDto = waypointService.getWaypoint(id);
        if (waypointDto == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(waypointDto, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<WaypointDto> addWaypoint(@RequestBody WaypointDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(waypointService.addWaypoint(dto));
    }

    @GetMapping
    public ResponseEntity<GeoJson> getWaypoints() {
        return ResponseEntity.ok(waypointService.getWaypoints());
    }
}
