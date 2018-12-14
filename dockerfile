FROM bycedric/ci-node as build
ARG SPOTIFY_CLIENT_ID
ENV REACT_APP_SPOTIFY_CLIENT_ID=$SPOTIFY_CLIENT_ID
WORKDIR /code
COPY . .
RUN npm install --no-save && npm run build

FROM bycedric/serve-webapp
COPY --from=build /code/build /var/www/http
EXPOSE 80
