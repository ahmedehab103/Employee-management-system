using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using ValidationException = EmployeeManagement.Application.Common.Exceptions.ValidationException;

namespace EmployeeManagement.Application.Common.Behaviors
{
    public class ValidationBehavior<TRequest, TResponse>(
        IEnumerable<IValidator<TRequest>> validators,
        ILogger<TRequest> logger)
        : Behavior<TRequest>(logger), IPipelineBehavior<TRequest, TResponse>

    {
        public async Task<TResponse> Handle(
            TRequest request,
            RequestHandlerDelegate<TResponse> next,
            CancellationToken cancellationToken)
        {
            if (!validators.Any())
            {
                return await next();
            }

            var context = new ValidationContext<TRequest>(request);

            var validationResults = await Task.WhenAll(
                validators.Select(v => v.ValidateAsync(context, cancellationToken))
            );

            var failures = validationResults
                .SelectMany(r => r.Errors)
                .Where(f => f is not null)
                .ToList();

            if (!failures.Any())
            {
                return await next();
            }

            LogError("VALIDATION_EXC", request, new Dictionary<string, object> { { "Failures", failures } });

            throw new ValidationException(failures);
        }
    }
}
