FROM ubuntu:xenial
RUN apt-get -y update && \
    apt-get -y install curl apt-transport-https git build-essential && \
    curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
    echo 'deb https://deb.nodesource.com/node_8.x zesty main' > /etc/apt/sources.list.d/nodesource.list && \
    apt-get -y update && \
    apt-get -y install nodejs
