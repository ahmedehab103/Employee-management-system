using System;
using System.Collections.Generic;

namespace EmployeeManagement.Domain.Models
{
    public interface IHasDomainEvent
    {
        public List<DomainEvent> DomainEvents { get; }
    }

    public class DomainEvent
    {
        protected DomainEvent() => DateOccurred = DateTimeOffset.UtcNow;

        public bool IsPublished { get; set; }
        public DateTimeOffset DateOccurred { get; protected set; }
    }
}
