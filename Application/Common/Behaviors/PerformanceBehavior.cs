using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EmployeeManagement.Application.Common.Behaviors
{
    public class PerformanceBehavior<TRequest, TResponse> : Behavior<TRequest>, IPipelineBehavior<TRequest, TResponse>
    {
        private readonly Stopwatch _timer;

        public PerformanceBehavior(
            ILogger<TRequest> logger,
            IApplicationUserService currentUser) : base(logger, currentUser)
            => _timer = new Stopwatch();

        public async Task<TResponse> Handle(
            TRequest request,
            RequestHandlerDelegate<TResponse> next,
            CancellationToken cancellationToken)
        {
            _timer.Start();

            var response = await next();

            _timer.Stop();

            var elapsedMilliseconds = _timer.ElapsedMilliseconds;

            if (elapsedMilliseconds > 500)
            {
                LogCritical("LONG_RUNNING_REQUEST",
                    request,
                    new Dictionary<string, object> { { "ElapsedMilliseconds", elapsedMilliseconds } });
            }

            return response;
        }
    }
}
