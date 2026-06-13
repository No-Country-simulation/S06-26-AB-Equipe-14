CREATE TABLE users (
  pk_user BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(180) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  role VARCHAR(50) DEFAULT 'VIEWER', -- Alterado de ENUM para VARCHAR por compatibilidade
  organisation VARCHAR(200),
  country VARCHAR(60),
  password VARCHAR(255) NOT NULL,    -- Simplificado para casar com o atributo Java
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL
);