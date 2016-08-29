FROM node:5.12

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

COPY . $HOME/client/
RUN chown -R app:app $HOME/*

WORKDIR $HOME/client
RUN npm install

EXPOSE 3000
CMD ["node", "test.js"]
