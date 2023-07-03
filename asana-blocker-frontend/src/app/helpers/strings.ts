export class Strings {
    static compareStringsCaseSensitive(string1: string, string2: string): boolean {
        if (typeof string1 !== 'string' ||
            typeof string2 !== 'string' ||
            string1.length !== string2.length) {
                return false;
        }

        const len = string1.length;
        for (let i = 0; i < len; i++) {
            if (string1[i] !== string2[i]) return false;
        }

        return true;
    }
}