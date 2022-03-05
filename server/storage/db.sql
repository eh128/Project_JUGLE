-- create database
CREATE DATABASE project_jugle;

-- create table
CREATE TABLE schools (
    id SERIAL NOT NULL PRIMARY KEY,
    school_name VARCHAR(255) NOT NULL,
    about TEXT NOT NULL
);

--add image_path column
ALTER TABLE schools ADD COLUMN image_path VARCHAR(255);

