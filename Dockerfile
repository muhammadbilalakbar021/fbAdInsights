FROM node:18 as build-deps
WORKDIR /usr/app
COPY package.json yarn.lock ./
ADD . ./
RUN yarn && yarn build
FROM node:18-alpine3.17
WORKDIR /payment
COPY --from=build-deps /usr/app/node_modules /payment/node_modules
COPY --from=build-deps /usr/app/package.json  /payment/package.json
COPY --from=build-deps /usr/app/yarn.lock /payment/yarn.lock
COPY --from=build-deps /usr/app/tsconfig.build.json  /payment/tsconfig.build.json
COPY --from=build-deps /usr/app/dist /payment/dist
COPY env  /payment/env
EXPOSE 4000
CMD ["yarn","start"]
