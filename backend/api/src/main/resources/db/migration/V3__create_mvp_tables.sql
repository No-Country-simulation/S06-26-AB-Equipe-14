-- Flyway migration: create MVP tables for Visent CDRView and related datasets
-- MySQL dialect
CREATE TABLE region (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  centroid_lat DOUBLE,
  centroid_lng DOUBLE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE antenna (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  region_id BIGINT,
  site_name VARCHAR(255),
  operator VARCHAR(128),
  technology VARCHAR(32),
  lat DOUBLE,
  lng DOUBLE,
  FOREIGN KEY (region_id) REFERENCES region(id) ON DELETE SET NULL
);

CREATE TABLE visent_record (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  region_id BIGINT NOT NULL,
  sample_date DATE NOT NULL,
  concentration DOUBLE DEFAULT 0,
  network_coverage_score DOUBLE DEFAULT 0,
  people_count BIGINT DEFAULT 0,
  source VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES region(id) ON DELETE CASCADE,
  INDEX idx_visent_region_date (region_id, sample_date)
);

CREATE TABLE training_program (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  region_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  provider VARCHAR(255),
  target_group VARCHAR(128),
  coverage VARCHAR(255),
  contact_info VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES region(id) ON DELETE CASCADE
);

CREATE TABLE employment_stat (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  region_id BIGINT NOT NULL,
  period_start DATE,
  period_end DATE,
  employment_rate DOUBLE,
  formal_employment_count BIGINT,
  total_population BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES region(id) ON DELETE CASCADE,
  INDEX idx_employment_region_period (region_id, period_start, period_end)
);

CREATE TABLE mental_health_indicator (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  region_id BIGINT NOT NULL,
  indicator_name VARCHAR(255) NOT NULL,
  value DOUBLE,
  source VARCHAR(255),
  measurement_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES region(id) ON DELETE CASCADE
);

CREATE TABLE mentorship_program (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  region_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  organization VARCHAR(255),
  contact_info VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES region(id) ON DELETE CASCADE
);

CREATE TABLE initiative (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  region_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  lead_contact VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES region(id) ON DELETE CASCADE
);
