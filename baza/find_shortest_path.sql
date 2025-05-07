CREATE OR REPLACE FUNCTION get_shortest_path(
    start_geom geometry,
    end_geom geometry
)
RETURNS TABLE (
    seq integer,
    node integer,
    edge integer,
    cost double precision,
    geom geometry
)
AS $$
DECLARE
    start_vid INTEGER;
    end_vid INTEGER;
BEGIN
    -- Snap start and end to nearest road
    SELECT id, source INTO start_vid
    FROM roads
    ORDER BY roads.geom <-> start_geom
    LIMIT 1;

    SELECT id, target INTO end_vid
    FROM roads
    ORDER BY roads.geom <-> end_geom
    LIMIT 1;

    RETURN QUERY
    SELECT p.seq, p.node, p.edge, p.cost, r.geom
    FROM pgr_dijkstra(
        'SELECT id, source, target, ST_Length(geom) AS cost FROM roads',
        start_vid,
        end_vid,
        false
    ) AS p
    JOIN roads r ON p.edge = r.id;
END;
$$ LANGUAGE plpgsql;
