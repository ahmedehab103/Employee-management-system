using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using EmployeeManagement.Application.Common.Exceptions;
using EmployeeManagement.Domain.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EmployeeManagement.Application.Common.Behaviors
{
    public class UnhandledExceptionBehavior<TRequest, TResponse>(ILogger<TRequest> logger) : Behavior<TRequest>(logger),
        IPipelineBehavior<TRequest, TResponse>
    {
        public async Task<TResponse> Handle(
            TRequest request,
            RequestHandlerDelegate<TResponse> next,
            CancellationToken cancellationToken)
        {
            try
            {
                return await next();
            }
            catch (DomainException e)
            {
                LogError("DOMAIN_EXCEPTION", request, new Dictionary<string, object> { { "Error", e } });

                throw new BadRequestException("DomainExceptionMessage");
            }
            catch (NotImplementedException)
            {
                throw new BadRequestException("NotImplemented");
            }
            catch (NotFoundException e)
            {
                LogError("NOT_FOUND", request, new Dictionary<string, object> { { "Exception", e } });

                throw;
            }
            catch (BadRequestException e)
            {
                LogError("BAD_REQUEST", request, new Dictionary<string, object> { { "Error", e } });

                throw;
            }
            catch (ForbiddenAccessException e)
            {
                LogError("FORBIDDEN_ACCESS", request, new Dictionary<string, object> { { "Exception", e } });

                throw;
            }
            catch (UnauthorizedAccessException e)
            {
                LogError("UNAUTHORIZED_ACCESS", request, new Dictionary<string, object> { { "Exception", e } });

                throw;
            }
            catch (Exception e) when (e is not ValidationException)
            {
                LogError("UNHANDLED_EXC", request, new Dictionary<string, object> { { "Exception", e } });

                throw new UnhandledRequestException($"Unhandled Request Exception in {typeof(TRequest).Name}", e);
            }
        }
    }
}
