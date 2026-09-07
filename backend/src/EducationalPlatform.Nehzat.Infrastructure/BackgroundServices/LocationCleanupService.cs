using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace EducationalPlatform.Nehzat.Infrastructure.BackgroundServices;

public class LocationCleanupService : BackgroundService
{
    private readonly IServiceProvider _services;
    public LocationCleanupService(IServiceProvider services) => _services = services;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _services.CreateScope();
            try
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var threshold = DateTime.UtcNow.AddMinutes(-30);
                var stale = db.Set<UserLocation>().Where(l => l.UpdatedAt < threshold);
                db.Set<UserLocation>().RemoveRange(stale);

                var expiredOrders = db.Set<MapOrder>().Where(o => o.Status == "pending" && o.CreatedAt < DateTime.UtcNow.AddHours(-24));
                foreach (var o in expiredOrders) o.Status = "expired";

                var deadDevices = db.Set<UserDevice>().Where(d => d.LastSeenAt < DateTime.UtcNow.AddDays(-60));
                db.Set<UserDevice>().RemoveRange(deadDevices);

                await db.SaveChangesAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"CleanupService error: {ex.Message}");
            }
            await Task.Delay(TimeSpan.FromMinutes(15), stoppingToken);
        }
    }
}