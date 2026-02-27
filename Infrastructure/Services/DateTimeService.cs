using System;
using EmployeeManagement.Application.Common.Interfaces;

namespace EmployeeManagement.Infrastructure.Services
{
    public class DateTimeService : IDateTime
    {
        public DateTime Now => DateTime.UtcNow;
    }
}
