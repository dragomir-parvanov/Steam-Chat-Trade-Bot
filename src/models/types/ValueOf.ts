type ValueOf<T> = T extends any[] ? T[number] : T[keyof T];

export default ValueOf;
