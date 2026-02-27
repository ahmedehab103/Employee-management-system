using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EmployeeManagement.Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace EmployeeManagement.Infrastructure.Middleware
{
    public class DomainEventMiddleware(RequestDelegate next, ILogger<DomainEventMiddleware> logger)
    {
        public const string DomainEventsKey = "DomainEventsKey";

        public async Task InvokeAsync(HttpContext context, IPublisher publisher)
        {
            context.Response.OnCompleted(async () =>
            {
                try
                {
                    if (context.Items.TryGetValue(DomainEventsKey, out var value) &&
                        value is List<DomainEvent> domainEvents)
                    {
                        foreach (var domainEvent in domainEvents)
                        {
                            await publisher.Publish(domainEvent);
                        }
                    }
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Failed to publish domain events after response");
                }
            });

            await next(context);
        }
    }
}
