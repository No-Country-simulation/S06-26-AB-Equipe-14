.PHONY: docker-up docker-down docker-build docker-logs docker-dev

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-build:
	docker compose build --no-cache

docker-logs:
	docker compose logs -f

docker-dev:
	docker compose up --build