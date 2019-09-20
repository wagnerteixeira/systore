@echo off
dotnet ef database drop --context SystoreContext --force
dotnet ef database drop --context AuditContext --force
rd /s /q Migrations\
dotnet ef migrations add InitialCreate --context SystoreContext
dotnet ef database update --context SystoreContext
dotnet ef migrations add InitialCreate --context AuditContext
dotnet ef database update --context AuditContext