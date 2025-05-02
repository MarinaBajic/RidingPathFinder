package com.reo.rpf.dto;

public record WaypointRequest(
        String name,
        String fclass,
        Double latitude,
        Double longitude
) {
}