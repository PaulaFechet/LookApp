namespace LookApp.Business.Identity
{
    public interface IPasswordHasher
    {
        string CreateHash(string password);

        bool IsHashMatching(string hash, string password);
    }
}
