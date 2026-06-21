.PHONY: docker-up docker-down docker-clean docker-build docker-logs docker-dev db-migrate db-migrate-local

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-clean:
	docker compose down -v

docker-build:
	docker compose build --no-cache

docker-logs:
	docker compose logs -f

docker-dev:
	docker compose up --build


db-migrate:
	docker compose exec backend python scripts/migrate.py

db-migrate-local:
	cd backend-fast && python scripts/migrate.py