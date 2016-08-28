FROM node:5.12

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

USER app

WORKDIR $HOME/web

# ADD package.json package.json
# RUN npm install
# ADD . .

# RUN script/migration run
# RUN script/bootstrap base

# CMD ["make", "server"]
# CMD ["node", "test.js"]
