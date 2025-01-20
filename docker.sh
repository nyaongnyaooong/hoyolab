if [ "$1" = "build" ] && [ "$2" = "dev" ]; then
    # 서버 프로젝트 이미지화
    docker build -f docker/dev.Dockerfile -t hoyolab-nest-dev .

    exit 0
fi

if [ "$1" = "build" ]; then
    # 서버 프로젝트 이미지화
    docker build -f docker/Dockerfile -t hoyolab-nest .
    exit 0
fi

if [ "$1" = "run" ]; then
    # docker run -d --name hoyolab-nest -p 2075:3000 nest-app
    docker run -d --name hoyolab-nest hoyolab-nest
    exit 0
fi

if [ "$1" = "up" ] && [ "$2" = "dev" ]; then
    docker-compose -f docker/docker-compose-dev.yml up -d
    docker logs -f hoyolab-nest-dev

    exit 0
fi

if [ "$1" = "down" ] && [ "$2" = "dev" ]; then
    docker-compose -f docker/docker-compose-dev.yml down
    docker rm -f hoyolab-nest-dev
    # remove dangling images
    if [ -n "$(docker images -f "dangling=true" -q)" ]; then
        docker rmi -f $(docker images -f "dangling=true" -q)
    else
        echo "No dangling images to remove."
    fi
    docker rmi -f hoyolab-nest-dev

    exit 0
fi

if [ "$1" = "logs" ] && [ "$2" = "dev" ]; then
    docker logs -f hoyolab-nest-dev
    exit 0
fi

if [ "$1" = "logs" ]; then
    docker logs -f hoyolab-nest
    exit 0
fi

if [ "$1" = "stop" ]; then
    docker stop hoyolab-nest
    docker rm hoyolab-nest
    exit 0
fi

if [ "$1" = "remove" ]; then
    docker rm hoyolab-nest
    exit 0
fi

if [ "$1" = "removei" ]; then
    # remove dangling images
    if [ -n "$(docker images -f "dangling=true" -q)" ]; then
        docker rmi -f $(docker images -f "dangling=true" -q)
    else
        echo "No dangling images to remove."
    fi

    docker rmi -f hoyolab-nest
    exit 0
fi

exit 1
