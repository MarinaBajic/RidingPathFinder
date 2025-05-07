SELECT * FROM public.waypoint
WHERE fclass='drinking_water' AND name IS NULL
ORDER BY id ASC;

SELECT * FROM public.waypoint
WHERE fclass='drinking_water'
ORDER BY id ASC;

UPDATE public.waypoint
SET name='Česma'
WHERE fclass='drinking_water' AND name IS NULL;

-----------------------------------------------
SELECT * FROM public.waypoint
WHERE fclass='viewpoint' AND name='Vidikovac'
ORDER BY id ASC;

SELECT * FROM public.waypoint
WHERE fclass='viewpoint'
ORDER BY id ASC;

UPDATE public.waypoint
SET name='Vidikovac'
WHERE fclass='viewpoint' AND name IS NULL;

-----------------------------------------------
SELECT * FROM public.waypoint
WHERE fclass='monument' AND name IS NULL
ORDER BY id ASC;

SELECT * FROM public.waypoint
WHERE fclass='monument'
ORDER BY id ASC;

DELETE FROM public.waypoint
WHERE fclass='monument' AND name IS NULL;

-----------------------------------------------
SELECT * FROM public.waypoint
WHERE fclass='park' AND name IS NULL
ORDER BY id ASC;

SELECT * FROM public.waypoint
WHERE fclass='park'
ORDER BY id ASC;

UPDATE public.waypoint
SET name='Park'
WHERE fclass='park' AND name IS NULL;

