using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using EmployeeManagement.Application.Common.Interfaces;
using EmployeeManagement.Application.Common.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Routing;

namespace EmployeeManagement.Infrastructure.Services
{
    public class RazorRendererService(
        IRazorViewEngine viewEngine,
        ITempDataProvider tempData,
        IServiceProvider services)
        : IRazorRendererService
    {
        public async Task<string> RenderAsync<TModel>(string viewName, TModel model) where TModel : EmailTemplate
        {
            var actionContext = GetActionContext();
            var view          = FindView(actionContext, viewName);

            await using var output = new StringWriter();

            var viewData = new ViewDataDictionary<TModel>(
                new EmptyModelMetadataProvider(),
                new ModelStateDictionary())
            {
                Model = model
            };

            if (model.ViewData is not null && model.ViewData.Any())
            {
                foreach (var (key, value) in model.ViewData)
                {
                    viewData[key] = value;
                }
            }

            var viewContext = new ViewContext(
                actionContext,
                view,
                viewData,
                new TempDataDictionary(actionContext.HttpContext, tempData),
                output,
                new HtmlHelperOptions());

            await view.RenderAsync(viewContext);

            return output.ToString();
        }

        private IView FindView(ActionContext actionContext, string viewName)
        {
            var getViewResult = viewName.StartsWith("/")
                ? viewEngine.GetView(null, viewName, true)
                : viewEngine.GetView(null, Path.Combine("/Views/Emails", viewName), true);

            if (getViewResult.Success)
            {
                return getViewResult.View;
            }

            var findViewResult = viewEngine.FindView(actionContext, viewName, true);

            if (findViewResult.Success)
            {
                return findViewResult.View;
            }

            var searchedLocations = getViewResult.SearchedLocations
                .Concat(findViewResult.SearchedLocations);

            var errorMessage = string.Join(
                Environment.NewLine,
                new[]
                    {
                        $"Unable to find view \"{viewName}\". The following locations were searched:"
                    }
                    .Concat(searchedLocations));

            throw new InvalidOperationException(errorMessage);
        }

        private ActionContext GetActionContext()
        {
            var httpContext = new DefaultHttpContext
            {
                RequestServices = services
            };

            return new ActionContext(httpContext, new RouteData(), new ActionDescriptor());
        }
    }
}
