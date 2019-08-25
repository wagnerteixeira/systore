﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Systore.Domain.Abstractions;
using Systore.Infra.Context;
using Systore.Infra.Abstractions;
using Systore.Services;
using Systore.Data.Abstractions;
using Systore.Data.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Systore.Domain;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Mvc.Authorization;
using System.IO;
using Microsoft.AspNetCore.Http;
using Serilog;
using Systore.Api.Extensions;

namespace Systore.Api
{
    public class Startup
    {
        private readonly IHostingEnvironment _env;

        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            Configuration = configuration;
            _env = env;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.UseSerilog();

            services.AddDbContext<SystoreContext>();
            services.AddDbContext<AuditContext>();

            services.AddScoped<ISystoreContext, SystoreContext>();
            services.AddScoped<IAuditContext, AuditContext>();

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.UseRepositories();
            services.UseServices();

            services.AddCors();
            Log.Logger.Information($"Ambiente de {_env.EnvironmentName} debug: {_env.IsDevelopment()}");
            Console.WriteLine($"Ambiente de {_env.EnvironmentName} debug: {_env.IsDevelopment()}");
            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);

            // configure jwt authentication
            var appSettings = appSettingsSection.Get<AppSettings>();
            Console.WriteLine($"ConnectionString: {appSettings.ConnectionString}");   
            if (_env.IsDevelopment())
            {                
                services.AddMvc(opts =>
                {
                    opts.Filters.Add(new AllowAnonymousFilter());
                }).SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            }
            else
                services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Systore", Version = "v1" });                

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,                          
                    Type = SecuritySchemeType.ApiKey,   
                    
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },       
                            
                           // In = ParameterLocation.Header
                        },
                        new[] { "readAccess", "writeAccess" }
                    }
                });

                //var path = Path.Combine(_env.ContentRootPath, "Systore.Controllers.xml");
                //c.IncludeXmlComments(path);
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            //app.UseHttpsRedirection();
            app.UseCors(builder =>
                builder.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader()
            );

          
            app.UseAuthentication();

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Systore");                                
            });

            app.UseMvc();

            // uncoment for automatic migration
            InitializeDatabase(app);
        }

        private void InitializeDatabase(IApplicationBuilder app)
        {
            using (var scope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                scope.ServiceProvider.GetRequiredService<SystoreContext>().Database.Migrate();
            }
        }
    }
}

