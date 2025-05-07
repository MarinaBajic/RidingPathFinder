-- Table of named routes
CREATE TABLE path (
    id SERIAL PRIMARY KEY,
    name TEXT,
    description TEXT
);

-- Join table connecting paths to road segments
CREATE TABLE path_segment (
    path_id INT REFERENCES path(id),
    road_id BIGINT REFERENCES road(id),
    PRIMARY KEY (path_id, road_id)
);
