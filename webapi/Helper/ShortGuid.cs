namespace webapi.Helper
{
    public class ShortGuid
    {
        private readonly Guid guid;
        private readonly string value;

        /// <summary>Create a 22-character case-sensitive short GUID.</summary>
        public ShortGuid(Guid guid)
        {
            this.guid = guid;
            value = Convert.ToBase64String(guid.ToByteArray())
                .Substring(0, 22)
                .Replace("/", "_")
                .Replace("+", "-");
        }

        /// <summary>Get the short GUID as a string.</summary>
        public override string ToString()
        {
            return this.value;
        }

        /// <summary>Get the Guid object from which the short GUID was created.</summary>
        public Guid ToGuid()
        {
            return this.guid;
        }

        /// <summary>Get a short GUID as a Guid object.</summary>
        /// <exception cref="System.ArgumentNullException"></exception>
        /// <exception cref="System.FormatException"></exception>
        public static ShortGuid Parse(string shortGuid)
        {
            if (shortGuid == null)
            {
                throw new ArgumentNullException("shortGuid");
            }
            else if (shortGuid.Length != 22)
            {
                throw new FormatException("Input string was not in a correct format.");
            }

            return new ShortGuid(new Guid(Convert.FromBase64String
                (shortGuid.Replace("_", "/").Replace("-", "+") + "==")));
        }

        public static ShortGuid? ParseOrDefault(string shortGuidString)
        {
            if (string.IsNullOrEmpty(shortGuidString))
            {
                return null;
            }

            byte[] buffer = new byte[16];
            if (Convert.TryFromBase64String
                (shortGuidString.Replace("_", "/").Replace("-", "+") + "==", buffer, out _))
            {
                return new ShortGuid(new Guid(buffer));
            }
            return null;
        }

        public static string? ParseOrDefault(Guid? guid)
        {
            if (guid is null)
            {
                return null;
            }
            return new ShortGuid((Guid)guid);

        }

        public static implicit operator string(ShortGuid guid)
        {
            return guid.ToString();
        }

        public static implicit operator Guid(ShortGuid shortGuid)
        {
            return shortGuid.guid;
        }
    }
}
