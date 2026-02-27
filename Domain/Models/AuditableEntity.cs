using System;

namespace EmployeeManagement.Domain.Models
{
    public abstract class AuditableEntity
    {
        public DateTimeOffset Created { get; set; }

        public string CreatedBy { get; set; }

        public DateTimeOffset? LastModified { get; set; }

        public string LastModifiedBy { get; set; }

        public DateTimeOffset? DeletedAt { get; set; }

        public string DeletedBy { get; set; }

        public bool Deleted { get; set; }
    }

    public abstract class AuditableEntity<T> : AuditableEntity
    {
        public T Id { get; set; }
    }
}
