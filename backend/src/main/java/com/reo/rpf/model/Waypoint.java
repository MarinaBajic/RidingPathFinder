package com.reo.rpf.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.locationtech.jts.geom.Point;

@Getter
@Setter
@Entity
@Table(name = "waypoint")
public class Waypoint {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "waypoint_id_gen")
    @SequenceGenerator(name = "waypoint_id_gen", sequenceName = "waypoint_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "description", length = Integer.MAX_VALUE)
    private String description;

    @Column(name = "location", columnDefinition = "geometry")
    private Point location;

}