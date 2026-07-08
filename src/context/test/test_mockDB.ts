import type { Todo } from '../../types/todo.js';
import type { MaybeTodo } from './types.js';
import { validateMockData } from './validator.js';

const mockDataBeforeValidation: MaybeTodo[] = [
  {
    id: '000001',
    task: 'amenbo',
    priority: 'high',
    deadline: '2027-05-11',
    isDone: false
  },
  {
    id: '000002',
    task: 'english lesson',
    priority: 'low',
    deadline: '2029-09-08',
    isDone: false
  },
  {
    id: '000003',
    task: 'oishii gohan taberu',
    priority: 'low',
    deadline: '2036-10-08',
    isDone: false
  },
  {
    id: '000004',
    task: 'bakuhatsu',
    priority: 'middle',
    deadline: '2028-01-30',
    isDone: true
  },
  {
    id: '000005',
    task: 'gottsandesu',
    priority: 'high',
    deadline: '2031-11-28',
    isDone: true
  },
  {
    id: '000006',
    task: 'chat with a cat',
    priority: 'middle',
    deadline: '2040-08-18',
    isDone: false
  },
  {
    id: '000007',
    task: 'kono task ha mechamecha nagai moziretsu nanode hyouzi sare nai youni natteiru kara error ni nari masu yo', // error
    priority: 'extra', // error
    deadline: '2026-04-27', // error -> 実際は error にならないほうがいい
    isDone: false
  }
];

export const mockInitialData: Todo[] = validateMockData(mockDataBeforeValidation);
