using System.Threading;
using System.Threading.Tasks;
using EmployeeManagement.Domain.Models;

namespace EmployeeManagement.Application.Common.Interfaces
{
    public interface IDomainEventService
    {
        Task Publish(DomainEvent e, CancellationToken ct = default);
    }
}
