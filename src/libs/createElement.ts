import { isElement } from '../utils/utils.js';

const allowedTagNames = ['table', 'thead', 'tbody', 'th', 'tr', 'td', 'input'] as const;
type AllowedTagName = (typeof allowedTagNames)[number];
const allowedPropsKeys = ['id', 'className', 'textContent', 'type', 'value', 'checked'] as const;
type AllowedPropsKey = (typeof allowedPropsKeys)[number];

const allowedPropsValueTypeList = ['number', 'radio', 'checkbox', 'button'];

const elementPropsValueValidatorMap: { [key in AllowedPropsKey]: (val: string) => boolean } = {
  id: (val) => /^[A-Za-z][\w-]*$/.test(val),
  className: (val) => /^[A-Za-z0-9_-]+(?:\s+[A-Za-z0-9_-]+)*$/.test(val) || val === '',
  type: (val) => allowedPropsValueTypeList.includes(val),
  value: (_val) => true,
  textContent: (_val) => true,
  checked: (val) => val === 'true' || val === 'false'
};

const elementPropsGrantorMap: { [key in AllowedPropsKey]: (el: HTMLElement, val: string) => void } = {
  id: (el, val) => {
    el.id = String(val);
  },
  className: (el, val) => {
    el.className = String(val);
  },
  textContent: (el, val) => {
    el.textContent = String(val);
  },
  type: (el, val) => {
    if (el instanceof HTMLInputElement === false && el instanceof HTMLButtonElement === false) return;
    el.type = String(val);
  },
  value: (el, val) => {
    if (el instanceof HTMLInputElement === false) return;
    el.value = String(val);
  },
  checked: (el, val) => {
    if (el instanceof HTMLInputElement === false) return;
    const stringVal = String(val);
    if (stringVal === 'true') el.checked = true;
    if (stringVal === 'false') el.checked = false;
  }
};

/**
 * DOM を生成し、テキストや属性の設定、子要素の追加を同時に行うユーティリティー関数
 * - 例外: **throw**
 * @param tagName - タグ名
 * @param props - DOM 要素のテキストや属性など
 * @param children - 子要素の配列
 * @returns
 */
export const createElement = (
  tagName: AllowedTagName,
  props: { [key: string]: string } = {},
  ...children: HTMLElement[] | string[]
) => {
  if (!allowedTagNames.includes(tagName)) throw new Error(`許可されていないタグ: ${tagName}`);
  const element = document.createElement(tagName);

  Object.entries(props).forEach(([key, value]) => {
    if (value == null) return;
    if (!isElement(key, allowedPropsKeys)) throw new Error(`許可されていないキー: ${key}`);
    if (typeof value !== 'string') throw new Error(`許可されていないペア キー: ${key} / 値: ${value}`);
    if (!elementPropsValueValidatorMap[key](value)) throw new Error(`許可されていないペア キー: ${key} / 値: ${value}`);
    elementPropsGrantorMap[key](element, value);
  });

  children.forEach((child) => {
    if (child == null) return;
    if (child instanceof HTMLElement) {
      element.appendChild(child);
    } else {
      element.appendChild(document.createTextNode(String(child)));
    }
  });

  return element;
};
