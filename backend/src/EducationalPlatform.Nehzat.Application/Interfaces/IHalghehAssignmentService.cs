using System.Collections.Generic;
using System.Threading.Tasks;
using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IHalghehAssignmentService
{
    Task<PaginatedResult<HalghehAssignmentDto>> GetByHalghehAsync(int halghehId, int page, int pageSize);
    Task<HalghehAssignmentDto?> GetByIdAsync(int halghehId, int assignmentId);
    Task<HalghehAssignmentDto> CreateAsync(int halghehId, CreateHalghehAssignmentDto dto);
    Task<HalghehAssignmentDto?> UpdateAsync(int halghehId, int assignmentId, UpdateHalghehAssignmentDto dto);
    Task DeleteAsync(int halghehId, int assignmentId);
    Task<List<HalghehAssignmentSubmissionDto>> GetSubmissionsAsync(int halghehId, int assignmentId);
    Task<HalghehAssignmentSubmissionDto?> SubmitAsync(int halghehId, int assignmentId, SubmitHalghehAssignmentDto dto);
    Task<HalghehAssignmentSubmissionDto?> ReviewAsync(int submissionId, ReviewHalghehAssignmentSubmissionDto dto);
}