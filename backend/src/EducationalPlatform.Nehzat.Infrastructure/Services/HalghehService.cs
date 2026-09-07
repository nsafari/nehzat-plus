using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class HalghehService : IHalghehService
{
    private readonly AppDbContext _context;

    public HalghehService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<HalghehDto>> GetAllAsync(int? maktabId = null)
    {
        var query = _context.Halghehs
            .Include(h => h.Maktab)
            .Where(h => h.IsActive);

        if (maktabId.HasValue)
            query = query.Where(h => h.MaktabId == maktabId.Value);

        return await query
            .OrderBy(h => h.SortOrder)
            .Select(h => new HalghehDto
            {
                Id = h.Id,
                MaktabId = h.MaktabId,
                MaktabName = h.Maktab.Name,
                Name = h.Name,
                NameEn = h.NameEn,
                Code = h.Code,
                Description = h.Description,
                IsActive = h.IsActive,
                SortOrder = h.SortOrder,
                CreatedAt = h.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<HalghehDto?> GetByIdAsync(int id)
    {
        return await _context.Halghehs
            .Include(h => h.Maktab)
            .Where(h => h.Id == id)
            .Select(h => new HalghehDto
            {
                Id = h.Id,
                MaktabId = h.MaktabId,
                MaktabName = h.Maktab.Name,
                Name = h.Name,
                NameEn = h.NameEn,
                Code = h.Code,
                Description = h.Description,
                IsActive = h.IsActive,
                SortOrder = h.SortOrder,
                CreatedAt = h.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<HalghehDto> CreateAsync(CreateHalghehDto dto)
    {
        var maktabExists = await _context.Maktabs.AnyAsync(m => m.Id == dto.MaktabId);
        if (!maktabExists)
            throw new KeyNotFoundException("مکتب پیدا نشد.");

        var entity = new Halgheh
        {
            MaktabId = dto.MaktabId,
            Name = dto.Name,
            NameEn = dto.NameEn,
            Code = dto.Code,
            Description = dto.Description,
            SortOrder = dto.SortOrder,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Halghehs.Add(entity);
        await _context.SaveChangesAsync();

        return new HalghehDto
        {
            Id = entity.Id,
            MaktabId = entity.MaktabId,
            Name = entity.Name,
            NameEn = entity.NameEn,
            Code = entity.Code,
            Description = entity.Description,
            IsActive = entity.IsActive,
            SortOrder = entity.SortOrder,
            CreatedAt = entity.CreatedAt
        };
    }

    public async Task<HalghehDto?> UpdateAsync(int id, UpdateHalghehDto dto)
    {
        var entity = await _context.Halghehs.FindAsync(id);
        if (entity == null) return null;

        if (dto.Name != null) entity.Name = dto.Name;
        if (dto.NameEn != null) entity.NameEn = dto.NameEn;
        if (dto.Code != null) entity.Code = dto.Code;
        if (dto.Description != null) entity.Description = dto.Description;
        if (dto.IsActive.HasValue) entity.IsActive = dto.IsActive.Value;
        if (dto.SortOrder.HasValue) entity.SortOrder = dto.SortOrder.Value;
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _context.Halghehs.FindAsync(id);
        if (entity == null) return false;

        _context.Halghehs.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
