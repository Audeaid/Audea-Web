import { IGetAllContent } from '../graphql';

export const convertArrayToCSV = (array: IGetAllContent[] | null) => {
  if (array === null || array.length === 0) {
    return ''; // If the array is null or empty, return an empty string
  }

  const keys = Object.keys(array[0]);
  const headerRow = keys.join(',') + '\n';

  const csvRows = array.map((object) =>
    keys
      .map((key) => {
        // Check if the property is the 'gptGenerated' field
        if (key === 'gptGenerated') {
          // Check if the value is null
          if (object[key] === null) {
            return 'null'; // Return an empty string if it's null
          }

          // Parse the JSON string into an array of objects
          const gptGeneratedArray = JSON.parse(object[key]!);
          // Extract the 'content' values from each object
          const contentArray = gptGeneratedArray.map(
            (item: { content: string }) => item.content
          );
          // Join the 'content' values into a string
          return '"' + contentArray.join(' ') + '"';
        } else {
          return JSON.stringify(object[key]);
        }
      })
      .join(',')
  );

  const csvString = headerRow + csvRows.join('\n');
  return csvString;
};
