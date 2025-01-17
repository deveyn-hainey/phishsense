const { getLabelArray } = require('../Code.js'); // Adjust path as needed.

test('getLabelArray sorts labels correctly', () => {
  const mockLabels = [
    { getName: () => 'Important' },
    { getName: () => 'Work' },
    { getName: () => 'Personal' },
  ];

  const result = getLabelArray(mockLabels);
  expect(result).toEqual(['Important', 'Personal', 'Work']); // Correct alphabetical order
});
