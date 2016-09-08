FROM node:5.12

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

COPY . $HOME/client/
RUN chown -R app:app $HOME/*

WORKDIR $HOME/client
RUN npm config set -g production false && npm install

RUN apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 \
    --recv-keys B97B0AFCAA1A47F044F244A07FCC7D46ACCC4CF8; \
  echo "deb http://apt.postgresql.org/pub/repos/apt/ precise-pgdg main" > \
    /etc/apt/sources.list.d/pgdg.list; \
  apt-get update && \
  apt-get install -y python-software-properties \
    software-properties-common postgresql-client-9.3

EXPOSE 3000
CMD ["make", "pm"]
