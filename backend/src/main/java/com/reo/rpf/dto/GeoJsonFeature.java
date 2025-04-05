package com.reo.rpf.dto;

import java.util.Map;

public record GeoJsonFeature(
        String type,
        Map<String, Object> geometry,
        Map<String, Object> properties
) {
}
