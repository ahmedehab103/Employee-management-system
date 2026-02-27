using System.Threading;
using System.Threading.Tasks;
using MediatR;

namespace EmployeeManagement.Application.Common.Interfaces
{
    public interface IClaroSender
    {
        Task<TResponse> Send<TResponse>(IRequest<TResponse> request, CancellationToken cancellationToken = default);
    }
}
