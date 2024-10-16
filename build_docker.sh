docker rm -f dev mongodb
docker compose up --build
docker cp dev:/home/app/node_modules ./node_modules