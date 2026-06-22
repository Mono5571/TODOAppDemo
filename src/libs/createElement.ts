import { isElement, isKey } from '../utils/utils.js';

const allowedTagNames = ['table', 'thead', 'tbody', 'th', 'tr', 'td', 'input', 'button'] as const;
type AllowedTagName = (typeof allowedTagNames)[number];
const allowedPropsKeys = ['id', 'className', 'textContent', 'type', 'value', 'checked'] as const;
type AllowedPropsKey = (typeof allowedPropsKeys)[number];
const allowedEventKeys = ['onClick', 'onChange', 'onInput'] as const;
type AllowedEventsKey = (typeof allowedEventKeys)[number];

const allowedPropsValueTypeList = ['number', 'radio', 'checkbox', 'button'];

type ElementProps = {
  readonly [key in AllowedPropsKey]?: string;
};

type BaseElementEvents = {
  readonly [key in AllowedEventsKey]?: (...args: unknown[]) => void;
};

type ElementEvents = Pick<Readonly<BaseElementEvents>, AllowedEventsKey>;

const _elementEventsCheck = {} as AllowedEventsKey satisfies keyof BaseElementEvents;

type CreateElementOptions = ElementProps & ElementEvents;

type PropsHandlers = {
  readonly [key in AllowedPropsKey]: {
    validate: (v: unknown) => v is string;
    apply: (el: HTMLElement, v: string) => void;
  };
};

type EventsHandlers = {
  readonly [key in AllowedEventsKey]: {
    validate: (v: unknown) => v is (...args: unknown[]) => void;
    apply: (el: HTMLElement, fn: (...args: unknown[]) => void) => void;
  };
};

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
      if (el instanceof HTMLInputElement === false) return;
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
  }
};

const eventsHandlers: EventsHandlers = {
  // Events
  onClick: {
    validate: (v: unknown): v is (...args: unknown[]) => void => typeof v === 'function',
    apply: (el: HTMLElement, fn: (...args: unknown[]) => void) => {
      el.addEventListener('click', fn);
    }
  },
  onChange: {
    validate: (v: unknown): v is (...args: unknown[]) => void => typeof v === 'function',
    apply: (el: HTMLElement, fn: (...args: unknown[]) => void) => {
      el.addEventListener('change', fn);
    }
  },
  onInput: {
    validate: (v: unknown): v is (...args: unknown[]) => void => typeof v === 'function',
    apply: (el: HTMLElement, fn: (...args: unknown[]) => void) => {
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
export const createElement = (
  tagName: AllowedTagName,
  options: CreateElementOptions = {},
  ...children: (HTMLElement | string)[]
) => {
  if (!allowedTagNames.includes(tagName)) throw new Error(`許可されていないタグ: ${tagName}`);
  const element = document.createElement(tagName);

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
