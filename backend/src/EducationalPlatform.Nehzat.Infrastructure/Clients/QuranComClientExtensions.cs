using Microsoft.Extensions.DependencyInjection;
using Refit;

namespace EducationalPlatform.Nehzat.Infrastructure.Clients;

public static class QuranComClientExtensions
{
    public static IServiceCollection AddQuranComClient(
        this IServiceCollection services,
        string baseUrl = "https://api.quran.com")
    {
        services.AddRefitClient<IQuranComClient>(new RefitSettings
        {
            ContentSerializer = new SystemTextJsonContentSerializer(
                new System.Text.Json.JsonSerializerOptions
                {
                    PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.SnakeCaseLower,
                    PropertyNameCaseInsensitive = true
                })
        })
        .ConfigureHttpClient(client =>
        {
            client.BaseAddress = new Uri(baseUrl.TrimEnd('/'));
            client.Timeout = TimeSpan.FromSeconds(30);
        });

        return services;
    }
}
