package com.reo.rpf.dto;

public record WaypointResponse(
        Integer id,
        String name,
        String description,
        Double latitude,
        Double longitude
) {
}