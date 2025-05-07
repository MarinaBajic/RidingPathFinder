package com.reo.rpf.service;

import com.reo.rpf.dto.GeoJson;
import com.reo.rpf.dto.GeoJsonFeature;
import com.reo.rpf.model.Path;
import com.reo.rpf.model.PathSegment;
import com.reo.rpf.repository.PathRepository;
import com.reo.rpf.repository.PathSegmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

import static com.reo.rpf.service.RoadService.getGeoJsonFeature;

@Service
@RequiredArgsConstructor
public class PathService {

    private final PathRepository pathRepository;
    private final PathSegmentRepository pathSegmentRepository;

    public Optional<Path> get(Integer id) {
        return pathRepository.findById(id);
    }

    public GeoJson get() {
        List<PathSegment> pathSegments = pathSegmentRepository.findAll();

        List<GeoJsonFeature> features = pathSegments.stream()
                .filter(pathSegment -> pathSegment.getGeom() != null)
                .map(this::createGeoJsonFeature)
                .toList();

        return new GeoJson("FeatureCollection", features);
    }

    private GeoJsonFeature createGeoJsonFeature(PathSegment pathSegment) {
        return getGeoJsonFeature(pathSegment.getGeom(), pathSegment.getName());
    }
}
