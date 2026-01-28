import { expect, test } from '@jest/globals';
import parse from 'html-react-parser';

// Simple test to ensure html-react-parser renders expected output

test('html-react-parser renders HTML as React elements', () => {
  const html = '<div><h1>Hello</h1><p>World</p></div>';
  const result = parse(html);
  // result is a React element tree
  expect(result).toBeTruthy();
  // Check structure
  // @ts-expect-error: result is ReactNode
  expect(result.type).toBe('div');
  // @ts-expect-error: result is ReactNode
  expect(result.props.children[0].type).toBe('h1');
  // @ts-expect-error: result is ReactNode
  expect(result.props.children[1].type).toBe('p');
});
