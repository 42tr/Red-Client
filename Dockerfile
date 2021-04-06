FROM node:14.13.1
WORKDIR /build
COPY package.json yarn.lock ./
RUN npm config set registry https://registry.npm.taobao.org/ --global
RUN npm config get registry
RUN yarn config set registry https://registry.npm.taobao.org/ --global
RUN yarn config get registry 
RUN yarn install
COPY . .
RUN CI=true npm test
RUN CI=true npm run build

FROM nginx
COPY --from=0 /build/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD sed "s~ACTIVE_PROFILE~$ACTIVE_PROFILE~g;s~EXTRA_CONFIG~$EXTRA_CONFIG~g;s~WORKER_IP~$WORKER_IP~g" /usr/share/nginx/html/config.template.json > /usr/share/nginx/html/config.json && nginx -g "daemon off;"
