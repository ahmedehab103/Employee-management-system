using System.Collections.Generic;
using System.Threading.Tasks;

namespace EmployeeManagement.Application.Common.Interfaces
{
    public abstract class EmailTemplate
    {
        public Dictionary<string, object> ViewData { get; set; }
    }

    public interface IRazorRendererService
    {
        Task<string> RenderAsync<TModel>(string viewName, TModel model) where TModel : EmailTemplate;
    }
}
