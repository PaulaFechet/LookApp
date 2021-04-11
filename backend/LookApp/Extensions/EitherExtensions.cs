using LanguageExt;

namespace LookApp.API.Extensions
{
    public static class EitherExtensions
    {
        public static L GetLeft<L, R>(this Either<L, R> either)
        {
            return either.LeftToList().First();
        }

        public static R GetRight<L, R>(this Either<L, R> either)
        {
            return either.RightToList().First();
        }
    }
}
