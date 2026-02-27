using System;
using System.Threading;
using System.Threading.Tasks;
using EmployeeManagement.Application.Common.Interfaces;
using EmployeeManagement.Domain.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace EmployeeManagement.Infrastructure.Services
{
    public class DomainEventService(
        ILogger<DomainEventService> logger,
        IServiceProvider serviceProvider) : IDomainEventService
    {
        public Task Publish(DomainEvent e, CancellationToken ct = default)
        {
            logger.LogInformation("Publishing domain event. Event - {Event}", e.GetType().Name);

            return Handle(e, ct);
        }

        private Task Handle<T>(T e, CancellationToken ct)
        {
            var eventType    = e.GetType();
            var handlerType  = typeof(IDomainEventHandler<>).MakeGenericType(eventType);
            var handleMethod = handlerType.GetMethod(nameof(IDomainEventHandler<T>.Handle));

            if (handleMethod is null)
                throw new InvalidOperationException("Could not find 'Handle' method on handler interface");

            var handler = serviceProvider.GetService(handlerType);

            if (handler is null)
            {
                logger.LogDebug("No handler registered for domain event {EventType}", eventType.Name);
                return Task.CompletedTask;
            }

            return (Task) handleMethod.Invoke(handler, new object[] { e, ct });
        }
    }
}
