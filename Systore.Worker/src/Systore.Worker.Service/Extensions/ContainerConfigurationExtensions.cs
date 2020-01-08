using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Composition;
using System.Composition.Convention;
using System.Composition.Hosting;
using System.IO;
using System.Linq;
using System.Runtime.Loader;
using System.Text;
using Systore.Worker.Abstractions;
using Systore.Worker.Abstractions.Providers;
using Systore.Worker.Service.Providers;

namespace Systore.Worker.Service.Extensions
{
    public static class ContainerConfigurationExtensions
    {
        public static ContainerConfiguration WithAssembliesInPath(this ContainerConfiguration configuration, string path, SearchOption searchOption = SearchOption.TopDirectoryOnly)
        {
            return WithAssembliesInPath(configuration, path, null, searchOption);
        }

        public static ContainerConfiguration WithAssembliesInPath(this ContainerConfiguration configuration, string path, AttributedModelProvider conventions, SearchOption searchOption = SearchOption.TopDirectoryOnly)
        {
            var assemblyFiles = Directory.GetFiles(path, "*.dll", searchOption);
            var assemblies = assemblyFiles.Select(AssemblyLoadContext.Default.LoadFromAssemblyPath);
            configuration = configuration.WithAssemblies(assemblies, conventions);
            return configuration;
        }

        public static IServiceCollection UseWorks(this IServiceCollection services, string path = "")
        {
            var conventions = new ConventionBuilder();

            conventions
               .ForTypesDerivedFrom<IWork>()
               .Export<IWork>()
               .Shared();

            path = string.IsNullOrWhiteSpace(path) ? AppContext.BaseDirectory : path;

            var configuration = new ContainerConfiguration()
               .WithAssembliesInPath(path, conventions);

            using (var container = configuration.CreateContainer())
            {
                var works = container
                     .GetExports<IWork>();

                services.AddSingleton(new WorkProvider(works));
            }

            return services;
        }

    }
}
