use EmployeeT_DB;

create table department (
	id int,
    name varchar(30),
    PRIMARY KEY (ID)
);

create table role (
	id int,
    name varchar(30),
    salary decimal,
    department_id int,
    PRIMARY KEY (ID)
);
create table employee (
	id int,
    first_name varchar(30),
    last_name varchar(30),
    role_id int,
    manager_id int,
    PRIMARY KEY (ID)
);


