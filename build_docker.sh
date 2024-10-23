docker rm -f dev mongodcb
docker compose up --build -d
docker cp dev:/home/app/node_modules ./node_modules