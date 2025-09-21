package com.reo.rpf.controller;

import com.reo.rpf.dto.GeoJson;
import com.reo.rpf.model.Path;
import com.reo.rpf.service.PathService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/paths")
public class PathController {

    private final PathService pathService;

//    @GetMapping("/segment/{id}")
//    public ResponseEntity<Path> getSegment(@PathVariable Integer id) {
//        if (pathService.get(id).isPresent()) {
//            return ResponseEntity.ok(pathService.get(id).get());
//        }
//        return ResponseEntity.notFound().build();
//    }

    @GetMapping("{id}")
    public ResponseEntity<Path> get(@PathVariable Integer id) {
        if (pathService.get(id).isPresent()) {
            return ResponseEntity.ok(pathService.get(id).get());
        }
        return ResponseEntity.notFound().build();
    }

    // umesto ovoga dobavlja sa geoservera
    @GetMapping
    public ResponseEntity<GeoJson> get() {
        return ResponseEntity.ok(pathService.get());
    }
}
