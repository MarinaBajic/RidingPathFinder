package com.reo.rpf.dto;

import java.util.List;

public record GeoJson(
        String type,
        List<GeoJsonFeature> features
) {
}
