export const allowedTagNames = ['table', 'thead', 'tbody', 'th', 'tr', 'td', 'input', 'button'] as const;
export type AllowedTagName = (typeof allowedTagNames)[number];
export const allowedPropsKeys = ['id', 'className', 'textContent', 'type', 'value', 'checked'] as const;
export type AllowedPropsKey = (typeof allowedPropsKeys)[number];
export const allowedEventKeys = ['onClick', 'onChange', 'onInput'] as const;
export type AllowedEventsKey = (typeof allowedEventKeys)[number];

export const allowedPropsValueTypeList = ['number', 'radio', 'checkbox', 'button'];

export type ElementProps = {
  readonly [key in AllowedPropsKey]?: string;
};

type BaseElementEvents = {
  readonly [key in AllowedEventsKey]?: (...args: unknown[]) => void;
};

type ElementEvents = Pick<Readonly<BaseElementEvents>, AllowedEventsKey>;

const _elementEventsCheck = {} as AllowedEventsKey satisfies keyof BaseElementEvents;

export type CreateElementOptions = ElementProps & ElementEvents;

export type PropsHandlers = {
  readonly [key in AllowedPropsKey]: {
    validate: (v: unknown) => v is string;
    apply: (el: HTMLElement, v: string) => void;
  };
};

export type EventsHandlers = {
  readonly [key in AllowedEventsKey]: {
    validate: (v: unknown) => v is (...args: unknown[]) => void;
    apply: (el: HTMLElement, fn: (...args: unknown[]) => void) => void;
  };
};
