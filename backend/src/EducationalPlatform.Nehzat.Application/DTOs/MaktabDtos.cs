namespace EducationalPlatform.Nehzat.Application.DTOs;

// ============ CREATE ============
public class CreateMaktabDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? City { get; set; }
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public bool IsPublic { get; set; } = false;
}

// ============ UPDATE ============
public class UpdateMaktabDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? City { get; set; }
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public string? Status { get; set; }
    public bool? IsPublic { get; set; }
}

// ============ RESPONSE ============
public class MaktabDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? City { get; set; }
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public int OwnerUserId { get; set; }
    public string OwnerName { get; set; } = string.Empty;
    public string InviteCode { get; set; } = string.Empty;
    public string Status { get; set; } = "active";
    public bool IsPublic { get; set; }
    public int MemberCount { get; set; }
    public string MyRole { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

// ============ MEMBER ============
public class MaktabMemberDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? NationalCode { get; set; }
    public string? Phone { get; set; }
    public string Role { get; set; } = "member";
    public string Status { get; set; } = "active";
    public DateTime JoinedAt { get; set; }
}

// ============ INVITE ============
public class InviteByNationalCodeDto
{
    public string NationalCode { get; set; } = string.Empty;
    public string Role { get; set; } = "member";
}

// ============ TRANSFER OWNERSHIP ============
public class TransferOwnershipDto
{
    public int NewOwnerUserId { get; set; }
}

// ============ MEMBER FILTER ============
public class MaktabMemberFilterDto
{
    public string? Search { get; set; }
    public string? Role { get; set; }
    public string? Status { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
