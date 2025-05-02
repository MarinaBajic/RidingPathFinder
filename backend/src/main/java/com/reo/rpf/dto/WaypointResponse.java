package com.reo.rpf.dto;

public record WaypointResponse(
        Integer id,
        String name,
        String fclass,
        Double latitude,
        Double longitude
) {
}