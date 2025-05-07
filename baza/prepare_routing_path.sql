-- Adds source and target columns for routing
ALTER TABLE road ADD COLUMN IF NOT EXISTS source INTEGER;
ALTER TABLE road ADD COLUMN IF NOT EXISTS target INTEGER;

-- Use topology function to assign nodes
SELECT pgr_createTopology('road', 0.0001, 'geom', 'id');
