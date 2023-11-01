FROM node:20-alpine as frontend-build
COPY angularapp/package.json angularapp/package-lock.json ./
RUN npm ci && mkdir /app && mv ./node_modules ./app
WORKDIR /app
COPY angularapp/. .
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS api-build
WORKDIR /source/webapi
COPY webapi/*.csproj .
RUN dotnet restore
COPY webapi/. .
RUN dotnet publish -c release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=api-build /app ./
COPY --from=frontend-build /app/dist/angularapp /app/wwwroot
ENTRYPOINT ["dotnet", "webapi.dll"]