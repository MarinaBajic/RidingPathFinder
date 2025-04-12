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

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable Integer id) {
        boolean deleted = waypointService.delete(id);
        if (deleted) {
            return new ResponseEntity<>(true, HttpStatus.OK);
        }
        return new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WaypointDto> getEntity(@PathVariable Integer id) {
        WaypointDto waypointDto = waypointService.getEntity(id);
        if (waypointDto == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(waypointDto, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<WaypointDto> create(@RequestBody WaypointDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(waypointService.create(dto));
    }

    @GetMapping
    public ResponseEntity<GeoJson> get() {
        return ResponseEntity.ok(waypointService.get());
    }
}
