package com.reo.rpf.service;

import com.reo.rpf.dto.GeoJson;
import com.reo.rpf.dto.GeoJsonFeature;
import com.reo.rpf.model.Poi;
import com.reo.rpf.repository.PoiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PoiService {

    private final PoiRepository poiRepository;

    public GeoJson get(Double minLng, Double minLat, Double maxLng, Double maxLat, Integer zoom) {
        List<String> poiClasses = getPoiClasses(zoom);
        List<Poi> pois = poiRepository.findPoisInBoundsWithClasses(minLng, minLat, maxLng, maxLat, poiClasses);

        List<GeoJsonFeature> features = pois.stream()
                .map(this::createGeoJsonFeature)
                .toList();

        return new GeoJson("FeatureCollection", features);
    }

    private List<String> getPoiClasses(Integer zoom) {
        List<String> poiClasses = new ArrayList<>();
        if (zoom > 6) {
            poiClasses.add("monument");
        }
        if (zoom > 8) {
            poiClasses.add("viewpoint");
            poiClasses.add("park");
        }
        if (zoom > 12) {
            poiClasses.add("drinking_water");
            poiClasses.add("water_well");
        }
        return poiClasses;
    }

    private GeoJsonFeature createGeoJsonFeature(Poi poi) {
        Map<String, Object> geometry = Map.of(
                "type", "Point",
                "coordinates", List.of(
                        poi.getGeom().getX(),
                        poi.getGeom().getY()
                )
        );

        Map<String, Object> properties = Map.of(
                "id", poi.getId(),
                "name", poi.getName() != null ? poi.getName() : poi.getFclass(),
                "fclass", poi.getFclass()
        );

        return new GeoJsonFeature("Feature", geometry, properties);
    }
}
