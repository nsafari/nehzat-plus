using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace EducationalPlatform.Nehzat.Infrastructure.BackgroundServices;

public class OrderExpiryService : BackgroundService
{
    private readonly IServiceProvider _services;
    public OrderExpiryService(IServiceProvider services) => _services = services;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _services.CreateScope();
            try
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var stuck = await db.Set<MapOrder>().Where(o => o.Status == "accepted" && o.UpdatedAt < DateTime.UtcNow.AddHours(-2)).ToListAsync(stoppingToken);
                foreach (var o in stuck)
                {
                    o.Status = "stuck";
                    o.UpdatedAt = DateTime.UtcNow;
                }
                await db.SaveChangesAsync(stoppingToken);
            }
            catch { }
            await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
        }
    }
}