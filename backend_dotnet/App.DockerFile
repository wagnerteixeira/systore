#Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
#For more information, please see https://aka.ms/containercompat

FROM microsoft/dotnet:2.2-aspnetcore-runtime-bionic AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/dotnet:2.2-sdk-bionic AS build
WORKDIR /src

COPY ["src", "/src/"]
RUN ls Systore.Api
RUN dotnet restore "./Systore.Api/Systore.Api.csproj"

COPY . .
WORKDIR "/src/Systore.Api"
RUN dotnet build "Systore.Api.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "Systore.Api.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Systore.Api.dll"]