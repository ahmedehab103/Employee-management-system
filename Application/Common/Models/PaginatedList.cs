using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Application.Common.Models
{
    public class PaginatedList<T>
    {
        private PaginatedList()
        {
            PageInfo = PageInfo.Empty();
            Items = new List<T>();
        }

        public PaginatedList(List<T> items, PageInfo pageInfo)
        {
            PageInfo = pageInfo;
            Items = items;
        }

        public PageInfo PageInfo { get; }

        public List<T> Items { get; }

        public static PaginatedList<T> GetEmpty() => new();

        public static async Task<PaginatedList<TDto>> CreateAsync<TDto>(
            IQueryable<T> source,
            Expression<Func<T, TDto>> map,
            PagingOptionsRequest request,
            bool all,
            CancellationToken ct)
        {
            var count = await source.CountAsync(ct);

            if (count == 0)
            {
                return new PaginatedList<TDto>();
            }

            var items = await request
                .Handle(source, all)
                .Select(map)
                .ToListAsync(ct);

            return new PaginatedList<TDto>(items, request.GetPageInfo(count));
        }

        public static async Task<(IQueryable<T> queryable, PageInfo info)> CreateAsync(
            IQueryable<T> source,
            PagingOptionsRequest request,
            bool all,
            CancellationToken ct)
        {
            var count = await source.CountAsync(ct);

            if (count == 0)
            {
                return (null, request.GetPageInfo(count));
            }

            var items = request
                .Handle(source, all)
                .AsQueryable();

            return (items, request.GetPageInfo(count));
        }
    }
}
