using Microsoft.Extensions.FileSystemGlobbing.Internal;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace webapi.Validators
{
    public class RegularExpressionListAttribute : RegularExpressionAttribute
    {
        public RegularExpressionListAttribute(string pattern)
            : base(pattern) { }

        public override bool IsValid(object? value)
        {
            if (value is null)
                return true;

            if (value is not IEnumerable<string>)
                return false;

            foreach (string element in value as IEnumerable<string> ?? Enumerable.Empty<string>())
            {
                if (!Regex.IsMatch(element, Pattern))
                    return false;
            }

            return true;
        }
    }
}
