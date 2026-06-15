.PHONY: backend frontend dev install clean

backend:
	cd backend-fast && ./venv/bin/python -m uvicorn main:app --reload

frontend:
	cd frontend && npm run dev

dev:
	$(MAKE) -j2 backend frontend

install:
	cd backend-fast && ./venv/bin/pip install -r requirements.txt
	cd frontend && npm install

clean:
	rm -rf frontend/.next