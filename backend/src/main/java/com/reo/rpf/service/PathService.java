package com.reo.rpf.service;

import com.reo.rpf.model.Road;
import com.reo.rpf.repository.RoadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PathService {

    private final RoadRepository roadRepository;

    public List<Road> getRoads(double minLng, double minLat, double maxLng, double maxLat, int zoom) {
        List<String> roadClasses = getRoadClasses(zoom);
        return roadRepository.findRoadsInBoundsWithClasses(minLng, minLat, maxLng, maxLat, roadClasses);
    }

    private List<String> getRoadClasses(Integer zoom) {
        List<String> roadClasses = new ArrayList<>();
        if (zoom > 6) {
            roadClasses.add("motorway");
            roadClasses.add("motorway_link");
            roadClasses.add("trunk");
            roadClasses.add("trunk_link");
        }
        if (zoom > 8) {
            roadClasses.add("primary");
            roadClasses.add("primary_link");
        }
        if (zoom > 12) {
            roadClasses.add("secondary");
            roadClasses.add("secondary_link");
        }
        if (zoom > 14) {
            roadClasses.add("tertiary");
            roadClasses.add("tertiary_link");
        }
        if (zoom > 15) {
            roadClasses.add("residential");
            roadClasses.add("service");
        }
        if (zoom > 16) {
            roadClasses.add("cycleway");
            roadClasses.add("footway");
            roadClasses.add("living_street");
            roadClasses.add("pedestrian");
            roadClasses.add("track");
            roadClasses.add("track_grade1");
            roadClasses.add("track_grade2");
            roadClasses.add("track_grade3");
            roadClasses.add("track_grade4");
            roadClasses.add("track_grade5");
            roadClasses.add("path");
            roadClasses.add("bridleway");
            roadClasses.add("steps");
            roadClasses.add("unclassified");
            roadClasses.add("unknown");
        }
        return roadClasses;
    }

}
