using System.Threading;
using System.Threading.Tasks;

namespace EmployeeManagement.Application.Common.Interfaces
{
    public interface IDomainEventHandler<in TDomainEvent>
    {
        Task Handle(TDomainEvent e, CancellationToken ct);
    }
}
