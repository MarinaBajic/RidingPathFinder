SELECT *
FROM pg_indexes
WHERE tablename = 'road';

CREATE INDEX road_geom_idx ON road USING GIST (geom);
