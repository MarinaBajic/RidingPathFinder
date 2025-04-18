package com.reo.rpf.dto;

public record WaypointRequest(
        String name,
        String description,
        Double latitude,
        Double longitude
) {
}