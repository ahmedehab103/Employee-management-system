using System;
using System.Collections.Generic;
using System.Linq;
using EmployeeManagement.Application.Common.Enums;
using EmployeeManagement.Application.Common.Extensions;
using EmployeeManagement.Application.Common.Interfaces;
using EmployeeManagement.Domain.Entities;
using EmployeeManagement.Domain.Enums;
using EmployeeManagement.Domain.ValueObjects;

namespace EmployeeManagement.Application.Identity.Models
{
    public class UserDto
    {
        public Guid Id { get; set; }

        public FullNameDto FullName { get; set; }

        public string PictureUrl { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }

        public AccountStatus Status { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public List<string> Companies { get; set; }

        public static UserDto Create(User source, IStorageLocationService locationService) => new()
        {
            Id = source.Id,
            FullName = source.Name.ProjectTo<FullNameDto, FullName>(),
            Email = source.Email,
            PictureUrl = string.IsNullOrEmpty(source.PictureUri)
                ? string.Empty
                : locationService.GetUrl(FileType.Picture.ToString(), source.PictureUri),
            PhoneNumber = source.PhoneNumber,
            Status = source.Status,
            CreatedAt = source.CreatedAt,
            Companies = source.Companies?.Select(c => c.Id.ToString()).ToList()
        };
    }
}
