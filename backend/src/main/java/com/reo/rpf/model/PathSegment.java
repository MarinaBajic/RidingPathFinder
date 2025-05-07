package com.reo.rpf.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.locationtech.jts.geom.MultiLineString;

@Getter
@Setter
@Entity
@Table(name = "path_segment")
public class PathSegment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "code")
    private Integer code;

    @Column(name = "fclass", length = 28)
    private String fclass;

    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "maxspeed")
    private Integer maxspeed;

    @Column(name = "road_id")
    private Integer roadId;

    @Column(name = "path_id")
    private Integer pathId;

    @JsonIgnore
    @Column(name = "geom", columnDefinition = "geometry")
    private MultiLineString geom;

}