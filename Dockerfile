FROM node:5.12

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app
ENV PORT=3000
ENV DEBUG="*cp*"
# ENV WORKSPACE=/home/app/client/
# RUN mkdir $WORKSPACE


# ADD package.json $WORKSPACE
# ADD Makefile $WORKSPACE
# COPY package.json Makefile $HOME/client/

COPY . $HOME/client/
RUN chown -R app:app $HOME/*

# USER app
WORKDIR $HOME/client
RUN npm install
# RUN pwd
# RUN ls -al
# RUN cat Makefile
# RUN cat Makefile | grep typings
# RUN ./node_modules/.bin/typings install -c $HOME/client/typings.json
# RUN pwd
# RUN ls -al
# RUN make build

# ADD package.json package.json
# RUN npm install
# ADD . .

# RUN script/migration run
# RUN script/bootstrap base

# CMD ["make", "server"]
# CMD ["node", "test.js"]
EXPOSE 3000
CMD ["node", "test.js"]
