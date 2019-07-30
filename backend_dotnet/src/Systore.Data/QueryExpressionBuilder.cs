using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using Systore.Domain.Entities;
using Systore.Domain.Enums;

namespace Systore.Data
{
    public static class QueryExpressionBuilder
    {
        private static readonly MethodInfo ContainsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) });
        private static readonly MethodInfo StartsWithMethod = typeof(string).GetMethod("StartsWith", new[] { typeof(string) });
        private static readonly MethodInfo EndsWithMethod = typeof(string).GetMethod("EndsWith", new[] { typeof(string) });

        #region DynamicWhere

        /// <summary>Where expression generator.</summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="filters">The filters.</param>
        /// <returns></returns>
        public static Expression<Func<T, bool>> GetExpression<T>(IEnumerable<FilterDto> filters)
        {
            var param = Expression.Parameter(typeof(T), "t");
            var body = filters
                .Select(filter => GetExpression(param, filter))
                .DefaultIfEmpty()
                .Aggregate(Expression.AndAlso);
            return body != null ? Expression.Lambda<Func<T, bool>>(body, param) : null;
        }

        /// <summary>Comparision operator expression generator.</summary>
        /// <param name="param">The parameter.</param>
        /// <param name="filter">The filter.</param>
        /// <returns></returns>
        private static Expression GetExpression(ParameterExpression param, FilterDto filter)
        {
            MemberExpression member = Expression.Property(param, filter.PropertyName);
            var type = member.Type;
            //ConstantExpression constant;            
            UnaryExpression constant;

            switch (type.Name)
            {
                case "Int32":
                    constant = Expression.Convert(Expression.Constant(Convert.ToInt32(filter.Value)), type);
                    break;
                case "String":
                    constant = Expression.Convert(Expression.Constant(filter.Value), type);
                    break;
                case "DateTime":
                    constant = Expression.Convert(Expression.Constant((DateTime)filter.Value), type);
                    break;
                case "Nullable`1":
                    var nullableType = Nullable.GetUnderlyingType(type);
                    switch (nullableType.Name)
                    {
                        case "DateTime":
                            constant = Expression.Convert(Expression.Constant((DateTime?)filter.Value), type);
                            break;
                        case "Int32":
                            constant = Expression.Convert(Expression.Constant((int?)filter.Value), type);
                            break;
                        default:
                            constant = Expression.Convert(Expression.Constant(filter.Value), type);
                            break;
                    }
                    break;
                default:
                    constant = Expression.Convert(Expression.Constant(filter.Value), type);
                    break;
            }

            // ConstantExpression constant = Expression.Constant(filter.Value);

            switch (filter.Operation)
            {
                case Operation.Eq:
                    return Expression.Equal(member, constant);

                case Operation.Gt:
                    return Expression.GreaterThan(member, constant);

                case Operation.Gte:
                    return Expression.GreaterThanOrEqual(member, constant);

                case Operation.Lt:
                    return Expression.LessThan(member, constant);

                case Operation.Lte:
                    return Expression.LessThanOrEqual(member, constant);

                case Operation.Con:
                    return Expression.Call(member, ContainsMethod, constant);

                case Operation.StW:
                    return Expression.Call(member, StartsWithMethod, constant);

                case Operation.EnW:
                    return Expression.Call(member, EndsWithMethod, constant);
            }

            return null;
        }

        #endregion

    }
}
