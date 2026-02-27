using System;
using System.Collections.Generic;

namespace EmployeeManagement.Application.Common.Helpers
{
    public class ProjectionEqualityComparer<TSource, TKey>
        : IEqualityComparer<TSource>
    {
        private readonly IEqualityComparer<TKey> _comparer;
        private readonly Func<TSource, TKey>     _projection;

        public ProjectionEqualityComparer(Func<TSource, TKey> projection)
            : this(projection, null) { }

        public ProjectionEqualityComparer(
            Func<TSource, TKey> projection,
            IEqualityComparer<TKey> comparer)
        {
            _comparer = comparer ?? EqualityComparer<TKey>.Default;
            _projection = projection ?? throw new ArgumentNullException(nameof(projection));
        }

        public bool Equals(TSource x, TSource y)
        {
            if (x is null && y is null)
            {
                return true;
            }

            if (x is null || y is null)
            {
                return false;
            }

            return _comparer.Equals(_projection(x), _projection(y));
        }

        public int GetHashCode(TSource obj)
        {
            if (obj is null)
            {
                throw new ArgumentNullException(nameof(obj));
            }

            return _comparer.GetHashCode(_projection(obj));
        }
    }
}
