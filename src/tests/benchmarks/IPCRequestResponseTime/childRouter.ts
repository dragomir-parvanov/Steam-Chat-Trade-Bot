export const childRouter = {
  multiplyByTwo: (number: number): number => {
    return number * 2;
  },
  someAsyncFunction: (someParam: number, someNotRequiredParam?: object) => {
    return new Promise<number>((resolve, reject) => {
      setTimeout(() => {
        if (someNotRequiredParam) {
          reject("Parameter is here!")
        } else {
          resolve(Math.pow(someParam,2))
        }
      })
    })
  }
};
