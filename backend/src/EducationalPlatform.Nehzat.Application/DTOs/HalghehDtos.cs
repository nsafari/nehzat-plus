namespace EducationalPlatform.Nehzat.Application.DTOs;

// ============ DTOهای موجود (دست نزن) ============

public class HalghehDto
{
    public int Id { get; set; }
    public int MaktabId { get; set; }
    public string? MaktabName { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateHalghehDto
{
    public int MaktabId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int SortOrder { get; set; } = 0;
}

public class UpdateHalghehDto
{
    public string? Name { get; set; }
    public string? NameEn { get; set; }
    public string? Code { get; set; }
    public string? Description { get; set; }
    public bool? IsActive { get; set; }
    public int? SortOrder { get; set; }
}

public class RingMaktabDto
{
    public int Id { get; set; }
    public int RingId { get; set; }
    public string? RingName { get; set; }
    public int MaktabId { get; set; }
    public string? MaktabName { get; set; }
    public int HalghehId { get; set; }
    public string? HalghehName { get; set; }
    public string? AcademicYear { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

// ============ DTOهای جدید Phase 6.5 ============

public class CreateHalghehFullDto
{
    public int MaktabId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? MaxMembers { get; set; }
}

public class UpdateHalghehFullDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public int? MaxMembers { get; set; }
    public string? Status { get; set; }
}

public class HalghehFullDto
{
    public int Id { get; set; }
    public int MaktabId { get; set; }
    public string MaktabName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? MaxMembers { get; set; }
    public int ModeratorUserId { get; set; }
    public string ModeratorName { get; set; } = string.Empty;
    public string Status { get; set; } = "active";
    public int MemberCount { get; set; }
    public string MyRole { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class HalghehMemberDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Role { get; set; } = "member";
    public string Status { get; set; } = "active";
    public DateTime JoinedAt { get; set; }
}

public class HalghehMemberFilterDto
{
    public string? Search { get; set; }
    public string? Role { get; set; }
    public string? Status { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class TransferModeratorDto
{
    public int NewModeratorUserId { get; set; }
}


