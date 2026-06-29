import { isElement } from '../../utils/utils.js';
import {
  allowedEventKeys,
  allowedPropsKeys,
  allowedPropsValueTypeList,
  allowedTagNames,
  type AllowedTagName,
  type CreateElementOptions,
  type EventsHandlers,
  type PropsHandlers
} from './types.js';

const propsHandlers: PropsHandlers = {
  id: {
    validate: (v: unknown): v is string => typeof v === 'string' && /^[A-Za-z][\w-]*$/.test(v),
    apply: (el: HTMLElement, v: string) => {
      el.id = String(v);
    }
  },
  className: {
    validate: (v: unknown): v is string =>
      (typeof v === 'string' && /^[A-Za-z0-9_-]+(?:\s+[A-Za-z0-9_-]+)*$/.test(v)) || v === '',
    apply: (el: HTMLElement, v: string) => {
      el.className = String(v);
    }
  },
  type: {
    validate: (v: unknown): v is string => typeof v === 'string' && allowedPropsValueTypeList.includes(v),
    apply: (el: HTMLElement, v: string) => {
      if (el instanceof HTMLInputElement === false && el instanceof HTMLButtonElement === false) return;
      el.type = String(v);
    }
  },
  textContent: {
    validate: (v: unknown): v is string => typeof v === 'string',
    apply: (el: HTMLElement, v: string) => {
      el.textContent = String(v);
    }
  },
  value: {
    validate: (v: unknown): v is string => typeof v === 'string',
    apply: (el: HTMLElement, v: string) => {
      if (
        !(el instanceof HTMLInputElement) &&
        !(el instanceof HTMLOptionElement) &&
        !(el instanceof HTMLButtonElement) &&
        !(el instanceof HTMLLIElement)
      )
        return;
      el.value = String(v);
    }
  },
  checked: {
    validate: (v: unknown): v is string => v === 'true' || v === 'false',
    apply: (el: HTMLElement, v: string) => {
      if (!(el instanceof HTMLInputElement)) return;
      if (v === 'true') {
        el.checked = true;
      } else if (v === 'false') {
        el.checked = false;
      }
      return;
    }
  },
  name: {
    validate: (v: unknown): v is string => typeof v === 'string',
    apply: (el: HTMLElement, v: string) => {
      if (
        !(el instanceof HTMLButtonElement) &&
        !(el instanceof HTMLFormElement) &&
        !(el instanceof HTMLFieldSetElement) &&
        !(el instanceof HTMLIFrameElement) &&
        !(el instanceof HTMLInputElement) &&
        !(el instanceof HTMLObjectElement) &&
        !(el instanceof HTMLOutputElement) &&
        !(el instanceof HTMLSelectElement)
      )
        return;
      el.name = v;
    }
  },
  for: {
    validate: (v: unknown): v is string => typeof v === 'string',
    apply: (el: HTMLElement, v: string) => {
      if (!(el instanceof HTMLLabelElement) && !(el instanceof HTMLOutputElement)) return;
      el.htmlFor = v;
    }
  }
};

const eventsHandlers: EventsHandlers = {
  // Events
  onClick: {
    validate: (v: unknown): v is (...args: unknown[]) => void => typeof v === 'function',
    apply: (el: HTMLElement, fn: (e?: Event, ...args: unknown[]) => void) => {
      el.addEventListener('click', fn);
    }
  },
  onChange: {
    validate: (v: unknown): v is (...args: unknown[]) => void => typeof v === 'function',
    apply: (el: HTMLElement, fn: (e?: Event, ...args: unknown[]) => void) => {
      el.addEventListener('change', fn);
    }
  },
  onInput: {
    validate: (v: unknown): v is (...args: unknown[]) => void => typeof v === 'function',
    apply: (el: HTMLElement, fn: (e?: Event, ...args: unknown[]) => void) => {
      el.addEventListener('input', fn);
    }
  }
};

/**
 * DOM を生成し、テキストや属性の設定、子要素の追加を同時に行うユーティリティー関数
 * - 例外: **throw**
 * @param tagName - タグ名
 * @param options - DOM 要素のテキストや属性、イベントリスナの登録など
 * @param children - 子要素の配列
 * @returns
 */
export function createElement<T extends AllowedTagName>(
  tagName: T,
  options: CreateElementOptions = {},
  ...children: (HTMLElement | string)[]
): HTMLElementTagNameMap[T] {
  if (!allowedTagNames.includes(tagName)) throw new Error(`許可されていないタグ: ${tagName}`);
  // html element の生成
  const element = document.createElement(tagName);

  // options に基づく属性の付与とイベントリスナの登録
  Object.entries(options).forEach(([key, value]) => {
    if (value == null) return;

    if (isElement(key, allowedPropsKeys)) {
      const handler = propsHandlers[key];
      if (!handler.validate(value)) throw new Error(`許可されていない値: ${value}`);

      handler.apply(element, value);
    } else if (isElement(key, allowedEventKeys)) {
      const handler = eventsHandlers[key];
      if (!handler.validate(value)) throw new Error(`許可されていない値: ${value}`);

      handler.apply(element, value);
    } else throw new Error(`許可されていないキー: ${key}`);
  });

  // children を受け取って子要素にする
  children.forEach((child) => {
    if (child == null) return;
    if (child instanceof HTMLElement) {
      element.appendChild(child);
    } else {
      element.appendChild(document.createTextNode(String(child)));
    }
  });

  return element;
}
