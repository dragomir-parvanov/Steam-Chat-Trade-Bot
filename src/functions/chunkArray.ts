/**
 * Split the array in an equal chunk sizes
 * @param array
 * @param chunkSize
 */
export default function chunkArray<T>(array: Array<T>, chunkSize: number): Array<Array<T>> {
  const result = array.reduce((resultArray: any[], item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] as never; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  return result;
}
