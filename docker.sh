if [ "$1" = "build" ]; then
    if [ -z "$2" ]; then
        # 서버 프로젝트 이미지화
        docker build -f docker/Dockerfile -t hoyolab-nest .
        exit 0
    fi

    if [ "$2" = "dev" ]; then
        # 서버 프로젝트 이미지화
        docker build -f docker/dev.Dockerfile -t hoyolab-nest-dev .
        exit 0
    fi

    exit 1
fi

if [ "$1" = "run" ]; then
    # docker run -d --name hoyolab-nest -p 2075:3000 nest-app
    docker run -d --name hoyolab-nest hoyolab-nest
    exit 0
fi

if [ "$1" = "up" ]; then
    if [ -z "$2" ]; then
        yarn build
        docker-compose -f docker/docker-compose.yml up -d
        docker logs -f hoyolab-nest

        exit 0
    fi

    if [ "$2" = "dev" ]; then
        docker-compose -f docker/docker-compose.yml down

        docker-compose -f docker/docker-compose-dev.yml build --no-cache
        docker-compose -f docker/docker-compose-dev.yml up -d
        docker logs -f hoyolab-nest-dev

        exit 0
    fi

    exit 1
fi

if [ "$1" = "down" ]; then
    if [ -z "$2" ]; then
        docker-compose -f docker/docker-compose.yml down
        docker rm -f hoyolab-nest
        # remove dangling images
        if [ -n "$(docker images -f "dangling=true" -q)" ]; then
            docker rmi -f $(docker images -f "dangling=true" -q)
        else
            echo "No dangling images to remove."
        fi
        docker rmi -f hoyolab-nest
        exit 0
    fi

    if [ "$2" = "dev" ]; then
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

    exit 1
fi

if [ "$1" = "logs" ]; then
    if [ -z "$2" ]; then
        docker logs -f hoyolab-nest
        exit 0
    fi

    if [ "$2" = "dev" ]; then
        docker logs -f hoyolab-nest-dev
        exit 0
    fi

    exit 1
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
