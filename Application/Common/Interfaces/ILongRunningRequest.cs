using MediatR;

namespace EmployeeManagement.Application.Common.Interfaces
{
    public interface ILongRunningRequest : IRequest { }

    public interface ILongRunningRequest<out TResponse> : IRequest<TResponse> { }

    public interface ILongRunningRequestHandler<in TRequest> : IRequestHandler<TRequest>
        where TRequest : ILongRunningRequest
    { }

    public interface ILongRunningRequestHandler<in TRequest, TResponse> : IRequestHandler<TRequest, TResponse>
        where TRequest : ILongRunningRequest<TResponse>
    { }
}
