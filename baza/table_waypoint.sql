CREATE TABLE waypoint (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    location GEOMETRY(Point, 4326)
);

INSERT INTO waypoint (name, description, location) VALUES 
('Uni', 'PMF', ST_SetSRID(ST_MakePoint(45.245512948206624, 19.853120319464185), 4326)),
('Dorm', 'Veljko Vlahovic', ST_SetSRID(ST_MakePoint(45.245679132775784, 19.848356716590246), 4326));

