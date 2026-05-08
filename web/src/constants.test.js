import { formatDeadline } from './features/dashboard/constants';

test('formatDeadline works correctly', () => {
  expect(formatDeadline('2026-05-08')).toBeDefined();
});
