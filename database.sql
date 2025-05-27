-- Database --
CREATE DATABASE student_org_management;

-- Database Tables --
CREATE TABLE STUDENT (
    student_number VARCHAR(10) PRIMARY KEY,
    first_name VARCHAR(50),
    middle_initial CHAR(1),
    last_name VARCHAR(50),
    gender ENUM('Male', 'Female', 'Others') NOT NULL,
    degree_program VARCHAR(100)
);


CREATE TABLE ORGANIZATION (
    organization_id INT PRIMARY KEY,
    organization_name VARCHAR(100)
);


CREATE TABLE ORGANIZATION_EVENT (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    organization_id INT,
    event_name VARCHAR(100),
    FOREIGN KEY (organization_id) REFERENCES ORGANIZATION(organization_id)
);


CREATE TABLE ORGANIZATION_COMMITTEE (
    committee_id INT PRIMARY KEY AUTO_INCREMENT,
    organization_id INT,
    committee_name VARCHAR(100),
    FOREIGN KEY (organization_id) REFERENCES ORGANIZATION(organization_id)
);


CREATE TABLE FEE (
    fee_id INT PRIMARY KEY,
    label VARCHAR(100),
    status ENUM('Paid', 'Unpaid', 'Late') DEFAULT 'Unpaid',
    amount DECIMAL(10, 2),
    date_issue DATE,
    due_date DATE,
    organization_id INT,
    student_number VARCHAR(10),
    FOREIGN KEY (organization_id) REFERENCES ORGANIZATION(organization_id),
    FOREIGN KEY (student_number) REFERENCES STUDENT(student_number)
);


CREATE TABLE BELONGS_TO (
    student_number VARCHAR(10),
    organization_id INT,
    committee_id INT, 
    membership_date DATE,
    status ENUM('Active', 'Inactive', 'Expelled', 'Suspended', 'Alumni') DEFAULT 'Active',
    role VARCHAR(100) DEFAULT 'Member',
    PRIMARY KEY (student_number, organization_id),
    FOREIGN KEY (student_number) REFERENCES STUDENT(student_number),
    FOREIGN KEY (organization_id) REFERENCES ORGANIZATION(organization_id),
    FOREIGN KEY (committee_id) REFERENCES ORGANIZATION_COMMITTEE(committee_id)  
);


CREATE VIEW BELONGS_TO_WITH_BALANCE AS
SELECT 
    bt.student_number,
    bt.organization_id,
    oc.committee_name AS committee_name,  
    bt.committee_id,
    bt.membership_date,
    COALESCE(SUM(f.amount), 0) AS remaining_balance,
    bt.status,
    bt.role
FROM BELONGS_TO bt
LEFT JOIN ORGANIZATION_COMMITTEE oc
    ON bt.committee_id = oc.committee_id  
LEFT JOIN FEE f
    ON bt.student_number = f.student_number
    AND bt.organization_id = f.organization_id
    AND f.status = 'Unpaid'
GROUP BY 
    bt.student_number, bt.organization_id, oc.committee_name, bt.committee_id,
    bt.membership_date, bt.status, bt.role;



-- POPULATION OF TABLES

-- students
INSERT INTO STUDENT VALUES
('2023-66249', 'Gray Velkan', 'P', 'Gonzales', 'Male', 'BSCS'),
('2023-13729', 'Marc Joemil', 'P', 'Mendoza', 'Female', 'BSCS'),
('2023-13730', 'Maria', 'P', 'Mendoza', 'Female', 'BSCS'),
('2023-11292', 'Thyron', 'G', 'Manamtam', 'Male', 'BSCS'),
('2023-04708', 'Diego', 'B', 'Mejorada', 'Male', 'BSCS'),
('2023-02256', 'Yuuri', 'F', 'Nonaka', 'Female', 'BSCS'),
('2023-11445', 'Jason Gian', 'B', 'Duran', 'Male', 'BSCS'),
('2023-51515', 'Yshihiro', 'S', 'Norio', 'Male', 'BSCS'),
('2023-00006', 'Sebastian Andrei', 'P', 'Merdegia', 'Male', 'BSCS'),
('2023-21245', 'Athalia Lexine', 'C', 'Marfil', 'Female', 'BSCS'),
('2022-87905', 'Cazhia Reese', 'P', 'Lleva', 'Female', 'BSCS'),
('2022-32856', 'Shane', 'L', 'Pepito', 'Female', 'BSCS'),
('2020-00543', 'Lyka Joyce', 'A', 'Aquino', 'Female', 'BSCS'),
('2022-01122', 'Kath', 'P', 'Leoncio', 'Female', 'BSCS'),
('2022-23232', 'Jed Alain', 'V', 'Silva', 'Male', 'BSCS'),
('2023-55555', 'Erin Reilley', 'S', 'Amistoso', 'Female', 'BSCS'),
('2023-66678', 'Ian Tristan', 'P', 'Arragona', 'Male', 'BSCS'),
('2023-11028', 'Maryz', 'B', 'Cabatingan', 'Female', 'BSCS'),
('2023-39083', 'Myko Jefferson', 'S', 'Javier', 'Male', 'BSCS'),
('2020-45013', 'Elvin Marc', 'I', 'Baustista', 'Male', 'BSCS'),
('2020-00457', 'Hannah', 'S', 'Samson', 'Female', 'BSCS'),
('2023-77882', 'John Emy', 'O', 'Bautista', 'Male', 'BSCS'),
('2023-12309', 'Abigail', 'S', 'Nadua', 'Female', 'BSCS'),
('2021-80317', 'Kyle Nathaniel', 'F', 'Vinuya', 'Male', 'BSCS'),
('2021-11408', 'Mikhaella Janna', 'J', 'Lim', 'Female', 'BSCS'),
('2024-10836', 'Miya', 'F', 'Gatotkaca', 'Female', 'BSCS'),
('2024-20455', 'Liam Ezekiel', 'J', 'Domingo', 'Male', 'BSCS'),
('2024-19876', 'Cheska Mae', 'P', 'Soriano', 'Female', 'BSCS'),
('2023-44567', 'Allen Royce', 'D', 'Villanueva', 'Male', 'BSCS'),
('2022-88901', 'Clarisse Anne', 'T', 'Agustin', 'Female', 'BSCS'),
('2021-34021', 'Rafael', 'M', 'Delos Reyes', 'Male', 'BSCS'),
('2022-56789', 'Jillian Rose', 'S', 'Peralta', 'Female', 'BSCS'),
('2023-12987', 'Hans Dominic', 'L', 'Austria', 'Male', 'BSCS'),
('2020-67345', 'Patricia', 'N', 'Cuevas', 'Female', 'BSCS'),
('2021-49002', 'Joshua Caleb', 'R', 'Guevarra', 'Male', 'BSCS'),
('2023-11234', 'Angelica Faith', 'A', 'Navarro', 'Female', 'BSCS'),
('2022-55678', 'Zachary Noah', 'C', 'Ramirez', 'Male', 'BSCS'),
('2024-87321', 'Elaine Sophia', 'T', 'Miranda', 'Female', 'BSCS'),
('2023-33445', 'Kenji Haru', 'F', 'Sakamoto', 'Male', 'BSCS'),
('2021-10012', 'Denise Camille', 'E', 'Alvarez', 'Female', 'BSCS'),
('2022-77890', 'Leonard James', 'U', 'Fernandez', 'Male', 'BSCS'),
('2024-30001', 'Tony', 'E', 'Stark', 'Male', 'BSCS'),
('2024-30002', 'Bruce', 'B', 'Wayne', 'Male', 'BSCS'),
('2024-30003', 'Diana', 'P', 'Prince', 'Female', 'BSCS'),
('2024-30004', 'Peter', 'B', 'Parker', 'Male', 'BSCS'),
('2024-30005', 'Clark', 'J', 'Kent', 'Male', 'BSCS'),
('2024-30006', 'Natasha', 'A', 'Romanoff', 'Female', 'BSCS'),
('2024-30007', 'Steve', 'R', 'Rogers', 'Male', 'BSCS'),
('2024-30009', 'Nadine', 'L', 'Lustre', 'Female', 'BSCS'),
('2024-30011', 'Kathryn', 'B', 'Bernardo', 'Female', 'BSCS'),
('2024-30012', 'Coco', 'S', 'Martin', 'Male', 'BSCS'),
('2024-30013', 'Sarah', 'G', 'Geronimo', 'Female', 'BSCS'),
('2024-30014', 'Vice', 'G', 'Ganda', 'Others', 'BSCS'),
('2024-30015', 'Manny', 'P', 'Pacquiao', 'Male', 'BSCS'), 
('2024-40001', 'Naruto', 'U', 'Uzumaki', 'Male', 'BSCS'),
('2024-40002', 'Sasuke', 'U', 'Uchiha', 'Male', 'BSCS'),
('2024-40003', 'Sakura', 'H', 'Haruno', 'Female', 'BSCS'),
('2024-40004', 'Hinata', 'H', 'Hyuga', 'Female', 'BSCS'),
('2024-40005', 'Kakashi', 'H', 'Hatake', 'Male', 'BSCS'),
('2024-40006', 'Itachi', 'U', 'Uchiha', 'Male', 'BSCS'),
('2024-40007', 'Luffy', 'D', 'Monkey', 'Male', 'BSCS'),
('2024-40008', 'Zoro', 'R', 'Roronoa', 'Male', 'BSCS'),
('2024-40009', 'Nami', 'B', 'Bellmere', 'Female', 'BSCS'),
('2024-40010', 'Sanji', 'V', 'Vinsmoke', 'Male', 'BSCS'),
('2024-40011', 'Levi', 'A', 'Ackerman', 'Male', 'BSCS'),
('2024-40012', 'Mikasa', 'A', 'Ackerman', 'Female', 'BSCS'),
('2024-40013', 'Eren', 'J', 'Yeager', 'Male', 'BSCS');


-- organizations --
INSERT INTO ORGANIZATION VALUES
(1, 'Young Software Engineers Society'),
(2, 'Computer Science Society'),
(3, 'Alliance of Computer Science Students'),
(4, 'Mathematical Science Society'),
(5, 'Game Development Society');




-- events –
INSERT INTO ORGANIZATION_EVENT (organization_id, event_name) VALUES
(1, 'Junior Hackfest'),
(3, 'Sublimed'),
(2, 'Warframes'),
(4, 'Glitz and Glam'),
(5, 'Game Jam'),
(1, 'Career Talks');

-- org committee–
INSERT INTO ORGANIZATION_COMMITTEE (organization_id, committee_name) VALUES
(1, 'Executive Committee'),
(1, 'Scholastic Committee'),
(1, 'Technical Committee'),
(1, 'Membership Committee'),
(1, 'Events Committee'),
(1, 'Publicity Committee'),
(1, 'Outreach Committee'),
(2, 'Executive Committee'),
(2, 'Technical Committee'),
(2, 'Membership Committee'),
(2, 'Events Committee'),
(2, 'Publicity Committee'),
(2, 'Scholastic Committee'),
(3, 'Executive Committee'),
(3, 'Technical Committee'),
(3, 'Membership Committee'),
(3, 'Events Committee'),
(3, 'Publicity Committee'),
(3, 'Scholastic Committee'),
(4, 'Executive Committee'),
(4, 'Technical Committee'),
(4, 'Scholastic Committee'),
(4, 'Events Committee'),
(4, 'Membership Committee'),
(4, 'Publicity Committee'),
(5, 'Executive Committee'),
(5, 'Technical Committee'),
(5, 'Scholastic Committee'),
(5, 'Membership Committee'),
(5, 'Events Committee'),
(5, 'Publicity Committee');











-- belongs to –
INSERT INTO BELONGS_TO VALUES
('2023-66249', 1, 1, '2025-01-10', 'Active', 'Visuals and Logistics Head'),
('2023-13729', 4, 22, '2025-01-11', 'Inactive', 'Member'),
('2023-13730', 2, 9, '2025-01-15', 'Active', 'Member'),
('2023-11292', 2, 10, '2025-01-12', 'Active', 'Team Lead'),
('2023-04708', 1, 3, '2025-01-13', 'Alumni', 'Member'),
('2023-02256', 3, 17, '2025-01-20', 'Active', 'Secretary'),
('2023-11445', 5, 31, '2025-01-22', 'Active', 'Member'),
('2023-51515', 4, 7, '2025-01-25', 'Active', 'Coordinator'),
('2023-00006', 2, 8, '2025-01-18', 'Active', 'Vice President'),
('2023-21245', 3, 15, '2025-01-30', 'Active', 'Team Lead'),
('2023-55555', 1, 5, '2025-02-05', 'Active', 'Member'),
('2023-66678', 5, 29, '2025-02-08', 'Active', 'Recruitment Officer'),
('2023-11028', 2, 12, '2025-02-10', 'Active', 'Member'),
('2023-39083', 4, 21, '2025-02-12', 'Active', 'Development Lead'),
('2023-77882', 3, 19, '2025-02-15', 'Inactive', 'Member'),
('2023-12309', 1, 4, '2025-02-18', 'Active', 'Member'),
('2023-44567', 5, 26, '2025-02-20', 'Active', 'President'),
('2023-12987', 2, 11, '2025-02-22', 'Active', 'Member'),
('2023-11234', 4, 25, '2025-02-25', 'Active', 'Media Officer'),
('2023-33445', 3, 15, '2025-03-01', 'Active', 'Member'),
('2022-87905', 5, 26, '2024-09-10', 'Active', 'Treasurer'),
('2022-32856', 1, 2, '2024-09-15', 'Active', 'Academic Head'),
('2022-01122', 2, 12, '2024-09-20', 'Active', 'Member'),
('2022-23232', 4, 23, '2024-09-25', 'Active', 'Logistics Coordinator'),
('2022-88901', 3, 16, '2024-10-01', 'Active', 'Member'),
('2022-56789', 5, 27, '2024-10-05', 'Active', 'Project Manager'),
('2022-55678', 1, 1, '2024-10-10', 'Active', 'Secretary'),
('2021-80317', 2, 8, '2024-05-15', 'Active', 'President'),
('2021-11408', 4, 21, '2024-05-20', 'Active', 'Development Lead'),
('2021-34021', 3, 17, '2024-06-01', 'Active', 'Head'),
('2021-49002', 5, 28, '2024-06-10', 'Active', 'Academic Officer'),
('2021-10012', 1, 6, '2024-06-15', 'Active', 'Media Director'),
('2020-00543', 3, 14, '2023-10-05', 'Alumni', 'Former President'),
('2020-45013', 5, 27, '2023-10-10', 'Alumni', 'Former Lead Developer'),
('2020-00457', 2, 11, '2023-10-15', 'Alumni', 'Former Head'),
('2020-67345', 4, 25, '2023-10-20', 'Alumni', 'Former Media Director'),
('2024-30001', 1, 3, '2025-03-10', 'Active', 'Engineering Lead'),
('2024-30002', 3, 14, '2025-03-12', 'Active', 'Vice President'),
('2024-30003', 5, 29, '2025-03-15', 'Active', 'Ambassador'),
('2024-30004', 2, 12, '2025-03-18', 'Active', 'Social Media Manager'),
('2024-30005', 4, 23, '2025-03-20', 'Active', 'Logistics Coordinator'),
('2024-30006', 1, 2, '2025-03-22', 'Active', 'Academic Support Officer'),
('2024-30007', 3, 15, '2025-03-25', 'Active', 'Member'),
('2024-30009', 5, 26, '2025-03-28', 'Active', 'Secretary'),
('2024-30011', 2, 11, '2025-04-01', 'Active', 'Member'),
('2024-30012', 4, 24, '2025-04-03', 'Active', 'Member'),
('2024-30013', 1, 6, '2025-04-05', 'Active', 'Member'),
('2024-30014', 3, 15, '2025-04-08', 'Active', 'Designer'),
('2024-30015', 5, 28, '2025-04-10', 'Active', 'Member'),
('2024-40001', 2, 8, '2025-04-12', 'Active', 'President'),
('2024-40002', 4, 21, '2025-04-15', 'Active', 'Backend Developer'),
('2024-40003', 1, 5, '2025-04-18', 'Active', 'Member'),
('2024-40004', 3, 18, '2025-04-20', 'Active', 'Content Creator'),
('2024-40005', 5, 29, '2025-04-22', 'Active', 'Recruitment Officer'),
('2024-40006', 2, 13, '2025-04-25', 'Active', 'Tutor'),
('2024-40007', 4, 20, '2025-04-28', 'Active', 'Treasurer'),
('2024-40008', 1, 3, '2025-05-01', 'Active', 'Security Specialist'),
('2024-40009', 3, 17, '2025-05-03', 'Active', 'Member'),
('2024-40010', 5, 31, '2025-05-05', 'Active', 'Member'),
('2024-40011', 2, 10, '2025-05-08', 'Active', 'Member'),
('2024-40012', 4, 20, '2025-05-10', 'Active', 'Secretary'),
('2024-40013', 1, 3, '2025-05-12', 'Active', 'Frontend Developer'),
('2024-10836', 3, 18, '2025-03-05', 'Active', 'Member'),
('2024-20455', 5, 30, '2025-03-08', 'Active', 'Member'),
('2024-19876', 2, 13, '2025-03-02', 'Active', 'Member'),
('2024-87321', 4, 24, '2025-03-30', 'Active', 'Member');





-- fees
INSERT INTO FEE VALUES
(101, 'Membership Fee', 'unpaid', 100.00, '2025-01-01', '2025-01-15', 1, '2023-66249'),
(102, 'Membership Fee', 'paid', 100.00, '2025-01-01', '2025-01-15', 1, '2023-13729'),
(103, 'Membership Fee', 'late', 100.00, '2025-01-01', '2025-01-15', 2, '2023-11292'),
(104, 'Membership Fee', 'paid', 100.00, '2025-02-01', '2025-02-15', 2, '2023-04708'),
(105, 'Membership Fee', 'unpaid', 100.00, '2025-01-01', '2025-01-15', 1, '2023-02256'),
(106, 'Sem Fee', 'unpaid', 500.00, '2025-01-01', '2025-01-15', 5, '2023-66249');






-- Update an event name
 UPDATE ORGANIZATION_EVENT SET event_name = 'Senior Hackfest 2025' WHERE event_id = 1;

INSERT INTO BELONGS_TO
VALUES ('2023-66249', 5, 30, '2025-01-10', 'Active', 'Member');




INSERT INTO FEE
VALUES (106, 'Membership Fee', 'unpaid', 500.00, '2025-01-01', '2025-01-15', 5, '2023-66249');




-- delete an event
DELETE FROM ORGANIZATION_EVENT WHERE event_name = 'Career Talks';


-- Reports–
View all members by role, status, gender, degree program, batch, and committee
SELECT 
    s.student_number,
    CONCAT(s.first_name, ' ', s.last_name) AS full_name,
    s.gender,
    s.degree_program,
    YEAR(bt.membership_date) AS batch,
    o.organization_name,
    oc.committee_name,
    bt.role,
    bt.status,
    bt.remaining_balance
FROM 
    STUDENT s
JOIN 
    BELONGS_TO_WITH_BALANCE bt ON s.student_number = bt.student_number
JOIN 
    ORGANIZATION o ON bt.organization_id = o.organization_id
LEFT JOIN 
    ORGANIZATION_COMMITTEE oc ON bt.committee_id = oc.committee_id
WHERE 
    1 = 1
    -- Optional Filters (uncomment and customize as needed):
    -- AND bt.role = 'President'
    -- AND bt.status = 'Active'
    -- AND s.gender = 'Female'
    -- AND s.degree_program = 'Computer Science'
    -- AND YEAR(bt.membership_date) = 2023
    -- AND oc.committee_name = 'Technical Committee'
ORDER BY 
    o.organization_name,
    bt.role,
    s.last_name,
    s.first_name;
