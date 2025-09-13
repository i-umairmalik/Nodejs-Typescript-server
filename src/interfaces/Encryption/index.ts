

export interface IEncryptionService {
    encrypt: (data: string) => string;
    decrypt: (data: string) => string;
    hashPassword: (password: string) => { salt: string, hash: string };
    compare_password: (userHash: string, password: string, salt: string) => Promise<boolean>;
    generate_field_token: (userField: string, salt: string) => string;
    generate_token: (user: any) => Promise<string>;
    generateEmailToken: (email: string, salt: string) => Promise<string>;
    generate_salt: () => string;
    generate_hash: (password: string, salt: string) => string;
}

export interface IEncryptionConfig {
    hashing: {
        saltBytes: number;
        iterations: number;
        keylen: number;
        digest: string;
    };
    aes: {
        aes_key: string;
        aes_iv: string;
        aes_algo: string;
        cipherEncoding: string;
        messageEncoding: string;
    };
}