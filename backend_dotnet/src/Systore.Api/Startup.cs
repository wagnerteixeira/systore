using System;
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
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Systore.Domain;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Mvc.Authorization;
using System.IO;
using Microsoft.AspNetCore.Http;
using Serilog;
using Systore.Api.Extensions;
using Systore.Report;
using System.Globalization;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Systore.Api
{
    public class Startup
    {
        private readonly IHostingEnvironment _env;
        private readonly AppSettings _appSettings;
        private readonly IConfigurationSection _appSettingsSection;

        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            Configuration = configuration;
            _env = env;
            _appSettingsSection = Configuration.GetSection("AppSettings");
            _appSettings = _appSettingsSection.Get<AppSettings>();


            string conSystore = Configuration.GetConnectionString("SystoreContext");
            Console.WriteLine(conSystore);
            string conAudit = Configuration.GetConnectionString("AuditContext");
            Console.WriteLine(conAudit);

            var section = Configuration.GetSection("ConnectionStrings");
            var a = section.GetValue<string>("SystoreContext");
            Console.WriteLine(a);
            var b = Configuration["ConnectionStrings:Redis"];
            Console.WriteLine(b);



        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddScoped<ISystoreContext, SystoreContext>()
                .AddScoped<IAuditContext, AuditContext>()
                .AddSingleton<IHttpContextAccessor, HttpContextAccessor>()
                .UseSerilog()
                .UseRepositories()
                .UseServices()
                .UseAutoMapper()
                .UseMetrics(Configuration, _env)
                .AddCors()
                .UseReport(_appSettings);



            services.AddDbContext<SystoreContext>(options =>
             {
                 if (_appSettings.DatabaseType == "MySql")
                     options.UseMySql(_appSettings.ConnectionString);
                 else if (_appSettings.DatabaseType == "InMem")
                     options.UseInMemoryDatabase("systore");
                 options.EnableSensitiveDataLogging();
             }).AddDbContext<AuditContext>(options =>
             {
                 if (_appSettings.DatabaseType == "MySql")
                     options.UseMySql(_appSettings.AuditConnectionString);
                 else if (_appSettings.DatabaseType == "InMem")
                     options.UseInMemoryDatabase("systoreAudit");
                 options.EnableSensitiveDataLogging();
             });


            Log.Logger.Information($"Ambiente de {_env.EnvironmentName} debug: {_env.IsDevelopment()}");
            Console.WriteLine($"Ambiente de {_env.EnvironmentName} debug: {_env.IsDevelopment()}");


            services.Configure<AppSettings>(_appSettingsSection);

            services.AddControllers();

            // configure jwt authentication
            Console.WriteLine($"ConnectionString: {_appSettings.ConnectionString}");
            var n = DateTime.UtcNow;
            if (_env.IsDevelopment())
            {                
                services.AddMvc(opts =>
                {
                    opts.Filters.Add(new AllowAnonymousFilter());
                }).AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.PropertyNamingPolicy = null;
                    options.JsonSerializerOptions.DictionaryKeyPolicy = null;                    
                }).SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
            }
            else
                services.AddMvc()
                    .AddJsonOptions(options =>
                    {
                        /*options.SerializerSettings.Formatting = Formatting.Indented;
                        options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
                        options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                        options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;*/
                        options.JsonSerializerOptions.PropertyNamingPolicy = null;
                        options.JsonSerializerOptions.DictionaryKeyPolicy = null;
                    }).SetCompatibilityVersion(CompatibilityVersion.Version_3_0);



            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);

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
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IApplicationLifetime lifetime)
        {
            app.UseRouting();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            var cultureInfo = new CultureInfo("pt-BR");

            //cultureInfo.NumberFormat.CurrencySymbol = "R$";
            //ci.NumberFormat.NumberDecimalSeparator = ".";
            //ci.NumberFormat.CurrencyDecimalSeparator = ".";

            CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
            CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;
            CultureInfo.CurrentCulture = cultureInfo;

            // Configure the Localization middleware
            app.UseRequestLocalization(new RequestLocalizationOptions
            {
                DefaultRequestCulture = new RequestCulture(cultureInfo),
                SupportedCultures = new List<CultureInfo>
            {
                cultureInfo,
            },
                SupportedUICultures = new List<CultureInfo>
            {
                cultureInfo,
            }
            });

            //app.UseHttpsRedirection();
            app.UseCors(builder =>
                builder.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader()
            )
            .UseAuthentication()
            .UseSwagger()// Enable middleware to serve generated Swagger as a JSON endpoint.
            .UseSwaggerUI(c =>
            {                                                             // specifying the Swagger JSON endpoint.
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Systore");// Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),                                                                         
            })
            .UseMetrics(lifetime)            
            .UseReport();
            
            Console.WriteLine($"Current culture: {CultureInfo.CurrentCulture}");
            Console.WriteLine($"Local timezone {TimeZoneInfo.Local} Utc {TimeZoneInfo.Utc}");

            app.UseEndpoints(endpoints => {
                endpoints.MapControllers();
            });

            // uncoment for automatic migration            
            InitializeDatabase(app);

        }

        private void InitializeDatabase(IApplicationBuilder app)
        {
            using (var scope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                if (_appSettings.DatabaseType == "Mysql")
                {
                    scope.ServiceProvider.GetRequiredService<SystoreContext>().Database.Migrate();
                    scope.ServiceProvider.GetRequiredService<AuditContext>().Database.Migrate();
                }
                else if (_appSettings.DatabaseType == "InMem")
                {
                    scope.ServiceProvider.GetRequiredService<SystoreContext>().Database.EnsureCreated();
                    scope.ServiceProvider.GetRequiredService<AuditContext>().Database.EnsureCreated();
                }
            }
        }
    }
}

