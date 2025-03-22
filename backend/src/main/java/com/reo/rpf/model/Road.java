package com.reo.rpf.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.locationtech.jts.geom.MultiLineString;

@Getter
@Setter
@Entity
@Table(name = "roads")
public class Road {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "roads_id_gen")
    @SequenceGenerator(name = "roads_id_gen", sequenceName = "roads_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "maxspeed")
    private Integer maxspeed;

    @Column(name = "fclass")
    private String fclass;

    @JsonIgnore
    @Column(name = "geom", columnDefinition = "geometry")
    private MultiLineString geom;

}