package com.reo.rpf.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.locationtech.jts.geom.Point;

@Getter
@Setter
@Entity
@Table(name = "poi")
public class Poi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ColumnDefault("nextval('pois_id_seq')")
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "code")
    private Integer code;

    @Column(name = "fclass", length = 28)
    private String fclass;

    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "geom", columnDefinition = "geometry")
    private Point geom;

}