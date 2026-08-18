using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EducationalPlatform.Nehzat.Infrastructure.Seeders;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("seeder")]
[Authorize(Roles = "admin,manager")]
public class SeederController : ControllerBase
{
    private readonly SampleDataSeeder _seeder;
    private readonly IWebHostEnvironment _env;

    public SeederController(SampleDataSeeder seeder, IWebHostEnvironment env)
    {
        _seeder = seeder;
        _env = env;
    }

    [HttpPost("seed")]
    public async Task<IActionResult> Seed()
    {
        if (!_env.IsDevelopment())
            return NotFound();

        try
        {
            await _seeder.SeedAsync();
            return Ok(new { message = "Sample data seeded successfully!" });
        }
        catch (Exception)
        {
            return StatusCode(500, new { error = "Failed to seed sample data" });
        }
    }
}
