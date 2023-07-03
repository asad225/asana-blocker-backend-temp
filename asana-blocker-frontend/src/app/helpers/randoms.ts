export class Randoms {
    static getRandomString(size: number): string {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890';
      const charactersLength = characters.length;
      let password = '';
      for (let i = 0; i < size; ++i) {
        password += characters[Math.floor(Math.random() * charactersLength)];
      }
      return password;
    }
}