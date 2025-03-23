package com.reo.rpf.service;

import com.reo.rpf.model.Waypoint;
import com.reo.rpf.repository.WaypointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WaypointService {

    private final WaypointRepository waypointRepository;

    public List<Waypoint> getWaypoints() {
        return waypointRepository.findAll();
    }
}
