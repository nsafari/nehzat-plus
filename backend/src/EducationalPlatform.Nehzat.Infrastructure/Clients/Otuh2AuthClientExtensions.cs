using Microsoft.Extensions.DependencyInjection;
using Polly;
using Polly.Extensions.Http;
using Refit;

namespace EducationalPlatform.Nehzat.Infrastructure.Clients;

public static class Otuh2AuthClientExtensions
{
    public static IServiceCollection AddOtuh2AuthClient(
        this IServiceCollection services,
        string authServiceUrl,
        string clientId = "nehzat-plus-client",
        string clientSecret = "",
        string apiKey = "")
    {
        var retryPolicy = HttpPolicyExtensions
            .HandleTransientHttpError()
            .WaitAndRetryAsync(
                retryCount: 3,
                sleepDurationProvider: retryAttempt =>
                    TimeSpan.FromMilliseconds(Math.Pow(2, retryAttempt) * 100));

        services.AddRefitClient<IOtuh2AuthClient>(new RefitSettings
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
            client.BaseAddress = new Uri(authServiceUrl.TrimEnd('/'));
            if (!string.IsNullOrEmpty(clientId))
                client.DefaultRequestHeaders.Add("X-Client-Id", clientId);
            if (!string.IsNullOrEmpty(clientSecret))
                client.DefaultRequestHeaders.Add("X-Client-Secret", clientSecret);
            if (!string.IsNullOrEmpty(apiKey))
                client.DefaultRequestHeaders.Add("X-Api-Key", apiKey);
        })
        .AddPolicyHandler(retryPolicy);

        return services;
    }
}
