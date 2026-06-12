CREATE TABLE users (
  pk_user BIGINT AUTO_INCREMENT PRIMARY KEY, -- Casará com 'private Long pkUser'
  email VARCHAR(180) NOT NULL UNIQUE,         -- Casará com 'private String email'
  password VARCHAR(255) NOT NULL,            -- Casará com 'private String password'
  name VARCHAR(120) NOT NULL                 -- Casará com 'private String name'
);