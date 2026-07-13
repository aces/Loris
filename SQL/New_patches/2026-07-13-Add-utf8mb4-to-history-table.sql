ALTER TABLE history CONVERT TO CHARACTER SET utf8mb4;

ALTER TABLE users 
    MODIFY Real_name varchar(255) CHARACTER SET utf8mb4,
    MODIFY First_name varchar(255) CHARACTER SET utf8mb4,
    MODIFY Last_name varchar(255) CHARACTER SET utf8mb4,
    MODIFY Email varchar(255) CHARACTER SET utf8mb4 NOT NULL DEFAULT '';