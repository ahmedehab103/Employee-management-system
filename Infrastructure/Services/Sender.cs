using System.Threading;
using System.Threading.Tasks;
using EmployeeManagement.Application.Common.Interfaces;
using MediatR;

namespace EmployeeManagement.Infrastructure.Services
{
    public class Sender(IMediator mediator) : IClaroSender
    {
        public Task<TResponse> Send<TResponse>(
            IRequest<TResponse> request,
            CancellationToken cancellationToken = default)
            => mediator.Send(request, cancellationToken);
    }
}
