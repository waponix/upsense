import crypto from 'crypto';

class Hash
{
    password(password: string, salt: string = '')
    {
        return crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    }
}

export default new Hash();
