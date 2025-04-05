package com.reo.rpf.dto;

public record WaypointDto(
        String name,
        String description,
        Double latitude,
        Double longitude
) {
}