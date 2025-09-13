import { Interfaces } from "../../interfaces";

const encryptionService = ({ helpers, config, logger }: { helpers: Interfaces.Helpers, config: Interfaces.ConfigProvider, logger: Interfaces.AppLogger }): Interfaces.EncryptionService => {
    const { crypto } = helpers;
    logger.info("Encryption service initialized");
    const { hashing, aes } = config.get("encryption");
    const generate_salt = (): string => {
        return helpers.crypto.randomBytes(hashing.saltBytes).toString("hex");
    };

    const generate_hash = (password: string, salt: string): string => {
        const { iterations, keylen, digest } = hashing;
        return helpers.crypto
            .pbkdf2Sync(password, salt, iterations, keylen, digest)
            .toString("hex");
    };

    const compare_password = async (userHash: string, password: string, salt: string): Promise<boolean> => {
        const computedHash = generate_hash(password, salt);
        return userHash === computedHash;
    };

    const generate_field_token = (userField: string, salt: string): string => {
        const { iterations, keylen, digest } = hashing;
        return helpers.crypto
            .pbkdf2Sync(userField, salt, iterations, keylen, digest)
            .toString("hex");
    };

    const encrypt = (plainText: string): string => {
        const { aes_key, aes_iv, aes_algo, cipherEncoding } = aes;
        try {
            let cipher = helpers.crypto.createCipheriv(aes_algo, aes_key, aes_iv);

            let encrypted = cipher.update(plainText);

            encrypted = Buffer.concat([encrypted, cipher.final()]);

            return encrypted.toString(cipherEncoding);
        } catch (ex) {
            logger.error(`Crypto > encrypt > error >`, ex instanceof Error ? ex : new Error(String(ex)));
            throw new Error('Encryption failed');
        }
    };
    const decrypt = (encryptedText: string): string => {
        const { aes_key, aes_iv, aes_algo, cipherEncoding } = aes;
        try {
            let decipher = helpers.crypto.createDecipheriv(aes_algo, aes_key, aes_iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString(cipherEncoding);
        } catch (ex) {
            logger.error(`Crypto > decrypt > error >`, ex instanceof Error ? ex : new Error(String(ex)));
            throw new Error('Decryption failed');
        }
    };
    const hashPassword = (password: string): { salt: string, hash: string } => {
        const salt = generate_salt();
        const hash = generate_hash(password, salt);
        return { salt, hash };
    };
    const generate_token = async (user: any): Promise<string> => {
        const { secretOrKey } = config.get("server");
        const token = await helpers.Jwt.sign(user, secretOrKey, {
            expiresIn: 60 * 60 * 24,
        });
        return token;
    };

    const generateEmailToken = async (email: string, salt: string): Promise<string> => {
        const { iterations, keylen, digest } = hashing;
        return helpers.crypto
            .pbkdf2Sync(email, salt, iterations, keylen, digest)
            .toString("hex");
    };




    return {
        encrypt,
        decrypt,
        hashPassword,
        compare_password,
        generate_field_token,
        generateEmailToken,
        generate_token,
        generate_salt,
        generate_hash,
    };
};

export default encryptionService;