CREATE TABLE regions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  state VARCHAR(60),
  country VARCHAR(60) NOT NULL,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  population BIGINT,
  area_km2 DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cdr_snapshots (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  region_id BIGINT NOT NULL,
  snapshot_date DATE NOT NULL,
  hour_slot TINYINT NOT NULL,
  people_concentration DECIMAL(10,2),
  network_coverage_pct DECIMAL(5,2),
  erb_count INT,
  tech_type ENUM('2G','3G','4G','5G'),
  signal_strength_dbm DECIMAL(6,2),
  source VARCHAR(60),
  raw_json JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regions(id)
);
