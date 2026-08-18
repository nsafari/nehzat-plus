using System;
using System.Collections.Generic;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public class HalghehAssignmentDto
{
    public int Id { get; set; }
    public int HalghehId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? DueDate { get; set; }
    public string Status { get; set; } = "active";
    public string MySubmissionStatus { get; set; } = "";
    public int SubmissionCount { get; set; }
    public string CreatorName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateHalghehAssignmentDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? DueDate { get; set; }
}

public class UpdateHalghehAssignmentDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? DueDate { get; set; }
    public string Status { get; set; } = "active";
}

public class HalghehAssignmentSubmissionDto
{
    public int Id { get; set; }
    public int HalghehAssignmentId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Status { get; set; } = "submitted";
    public string? Feedback { get; set; }
    public int? Grade { get; set; }
    public DateTime SubmittedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }
}

public class SubmitHalghehAssignmentDto
{
    public string Content { get; set; } = string.Empty;
}

public class ReviewHalghehAssignmentSubmissionDto
{
    public string Status { get; set; } = "approved"; // approved | rejected
    public string? Feedback { get; set; }
    public int? Grade { get; set; } // 0-20
}