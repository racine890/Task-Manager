-- Migration 0.0.0.2: Add change_project_status and change_task_status rights

-- Insert change_project_status right if it doesn't exist
INSERT INTO `right` (name, active) SELECT 'change_project_status', 1 WHERE NOT EXISTS (SELECT 1 FROM `right` WHERE name = 'change_project_status');
-- Assign change_project_status to worker (role 2)
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 2 FROM `right` r WHERE r.name = 'change_project_status' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 2);
-- Assign change_project_status to manager (role 3)
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 3 FROM `right` r WHERE r.name = 'change_project_status' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 3);

-- Insert change_task_status right if it doesn't exist
INSERT INTO `right` (name, active) SELECT 'change_task_status', 1 WHERE NOT EXISTS (SELECT 1 FROM `right` WHERE name = 'change_task_status');
-- Assign change_task_status to worker (role 2)
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 2 FROM `right` r WHERE r.name = 'change_task_status' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 2);
-- Assign change_task_status to manager (role 3)
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 3 FROM `right` r WHERE r.name = 'change_task_status' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 3);

-- Delete my rights
INSERT INTO `right` (name, active) SELECT 'delete_my_idea', 1 WHERE NOT EXISTS (SELECT 1 FROM `right` WHERE name = 'delete_my_idea');
INSERT INTO `right` (name, active) SELECT 'delete_my_task', 1 WHERE NOT EXISTS (SELECT 1 FROM `right` WHERE name = 'delete_my_task');

-- Assign delete_my_idea to worker (role 2) and manager (role 3)
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 2 FROM `right` r WHERE r.name = 'delete_my_idea' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 2);
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 3 FROM `right` r WHERE r.name = 'delete_my_idea' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 3);

-- Assign delete_my_task to worker (role 2) and manager (role 3)
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 2 FROM `right` r WHERE r.name = 'delete_my_task' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 2);
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 3 FROM `right` r WHERE r.name = 'delete_my_task' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 3);

-- Update my rights
INSERT INTO `right` (name, active) SELECT 'update_my_idea', 1 WHERE NOT EXISTS (SELECT 1 FROM `right` WHERE name = 'update_my_idea');
INSERT INTO `right` (name, active) SELECT 'update_my_task', 1 WHERE NOT EXISTS (SELECT 1 FROM `right` WHERE name = 'update_my_task');

-- Assign update_my_idea to worker (role 2) and manager (role 3)
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 2 FROM `right` r WHERE r.name = 'update_my_idea' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 2);
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 3 FROM `right` r WHERE r.name = 'update_my_idea' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 3);

-- Assign update_my_task to worker (role 2) and manager (role 3)
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 2 FROM `right` r WHERE r.name = 'update_my_task' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 2);
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 3 FROM `right` r WHERE r.name = 'update_my_task' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 3);

-- Resource my_* rights
INSERT INTO `right` (name, active) SELECT 'delete_my_resource', 1 WHERE NOT EXISTS (SELECT 1 FROM `right` WHERE name = 'delete_my_resource');
INSERT INTO `right` (name, active) SELECT 'update_my_resource', 1 WHERE NOT EXISTS (SELECT 1 FROM `right` WHERE name = 'update_my_resource');

-- Assign delete_my_resource to worker (role 2) and manager (role 3)
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 2 FROM `right` r WHERE r.name = 'delete_my_resource' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 2);
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 3 FROM `right` r WHERE r.name = 'delete_my_resource' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 3);

-- Assign update_my_resource to worker (role 2) and manager (role 3)
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 2 FROM `right` r WHERE r.name = 'update_my_resource' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 2);
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 3 FROM `right` r WHERE r.name = 'update_my_resource' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 3);

-- Report printing right
INSERT INTO `right` (name, active) SELECT 'print_report', 1 WHERE NOT EXISTS (SELECT 1 FROM `right` WHERE name = 'print_report');
-- Assign print_report to worker (role 2) and manager (role 3)
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 2 FROM `right` r WHERE r.name = 'print_report' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 2);
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 3 FROM `right` r WHERE r.name = 'print_report' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 3);

-- Add ownership-based delete_my_*/update_my_* rights

INSERT INTO `right` (name, active) SELECT 'read_my_resource', 1 WHERE NOT EXISTS (SELECT 1 FROM `right` WHERE name = 'read_my_resource');
INSERT INTO `right` (name, active) SELECT 'read_my_idea', 1 WHERE NOT EXISTS (SELECT 1 FROM `right` WHERE name = 'read_my_idea');

INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 2 FROM `right` r WHERE r.name = 'read_my_resource' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 2);
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 3 FROM `right` r WHERE r.name = 'read_my_idea' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 3);

INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 2 FROM `right` r WHERE r.name = 'read_my_resource' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 2);
INSERT INTO `right_role` (right_id, role_id) SELECT r.id, 3 FROM `right` r WHERE r.name = 'read_my_idea' AND NOT EXISTS (SELECT 1 FROM `right_role` WHERE right_id = r.id AND role_id = 3);

insert into role (name) values ('public_user');
insert into role (name) values ('ai_agent');
insert into role (name) values ('common_partner');
insert into role (name) values ('product_owner');

INSERT INTO right_role (right_id, role_id) SELECT r.id, ro.id FROM "right" AS r CROSS JOIN "role" AS ro WHERE r.name IN ('read_my_idea', 'create_idea', 'update_my_idea', 'delete_my_idea', 'read_project', 'read_task', 'read_my_resource', 'update_my_resource', 'delete_my_resource', 'read_category') AND ro.name = 'public_user' AND NOT EXISTS (SELECT 1 FROM right_role AS rr WHERE rr.right_id = r.id AND rr.role_id = ro.id);
INSERT INTO right_role (right_id, role_id) SELECT r.id, ro.id FROM "right" AS r CROSS JOIN "role" AS ro WHERE r.name IN ('read_idea', 'create_idea', 'update_my_idea', 'delete_my_idea', 'read_project', 'read_task', 'read_resource', 'update_my_resource', 'delete_my_resource', 'read_category') AND ro.name = 'common_partner' AND NOT EXISTS (SELECT 1 FROM right_role AS rr WHERE rr.right_id = r.id AND rr.role_id = ro.id);
INSERT INTO right_role (right_id, role_id) SELECT r.id, ro.id FROM "right" AS r CROSS JOIN "role" AS ro WHERE r.name IN ('read_idea', 'create_idea', 'update_my_idea', 'delete_my_idea', 'read_project', 'read_task', 'read_resource', 'update_my_resource', 'delete_my_resource', 'read_category', 'print_report', 'validate_task_evaluation') AND ro.name = 'product_owner' AND NOT EXISTS (SELECT 1 FROM right_role AS rr WHERE rr.right_id = r.id AND rr.role_id = ro.id);
INSERT INTO right_role (right_id, role_id) SELECT r.id, ro.id FROM "right" AS r CROSS JOIN "role" AS ro WHERE r.name IN ('read_idea', 'read_project', 'change_task_status', 'read_task', 'update_task', 'create_task', 'read_resource', 'read_category') AND ro.name = 'ai_agent' AND NOT EXISTS (SELECT 1 FROM right_role AS rr WHERE rr.right_id = r.id AND rr.role_id = ro.id);

-- Add phone column for Telegram notifications

ALTER TABLE user ADD COLUMN phone varchar(30) DEFAULT '';

-- Add priority column to task table
ALTER TABLE task ADD COLUMN priority INTEGER DEFAULT 0;
