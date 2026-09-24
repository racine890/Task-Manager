ALTER TABLE note ADD COLUMN edit_date timestamp;
UPDATE note SET edit_date = create_date WHERE edit_date IS NULL;

ALTER TABLE category ADD COLUMN target varchar(10) default 'both';
UPDATE category SET target = 'project' WHERE name IN ('App Development', 'Agile Sprint', 'App Promotion', 'Forum');
UPDATE category SET target = 'task' WHERE name IN ('Feature', 'Issue', 'Meeting');
UPDATE category SET target = 'both' WHERE name = 'Other';

ALTER TABLE category ADD COLUMN initial_status integer default 0;
ALTER TABLE category ADD COLUMN allowed_statuses text default '0,1,2,3,4,5,6';

UPDATE category SET initial_status = 5, allowed_statuses = '5' WHERE name = 'Meeting';
UPDATE category SET initial_status = 0, allowed_statuses = '0,1,2,3,4,5,6' WHERE name != 'Meeting';

ALTER TABLE idea ADD COLUMN project_id integer;

-- Migration: Add hourly_rate and external to project, evaluated_hours and evaluation_validated to task
-- Project fields for external billing
ALTER TABLE project ADD COLUMN hourly_rate decimal(10,2);
ALTER TABLE project ADD COLUMN external integer(1) default 0;
-- Task fields for evaluation workflow
ALTER TABLE task ADD COLUMN evaluated_hours integer;
ALTER TABLE task ADD COLUMN evaluation_validated integer(1) default 0;
-- Permission for validating task evaluation
INSERT INTO `right` (name, active) SELECT 'validate_task_evaluation', 1 WHERE NOT EXISTS (SELECT 1 FROM `right` WHERE name = 'validate_task_evaluation');
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 2 FROM `right` r WHERE r.name = 'validate_task_evaluation' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 2);
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 3 FROM `right` r WHERE r.name = 'validate_task_evaluation' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 3);
