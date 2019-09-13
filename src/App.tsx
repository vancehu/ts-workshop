import React, { useState } from 'react';
import './App.css';
import MonacoEditor from 'react-monaco-editor';

const pages: {
  title: string;
  body?: string;
  code: string;
}[] = [
    {
      title: 'Basic Syntax',
      code:
        `// basic Types
const isDone: boolean = true;
const age: number = 24;
const firstName: string = 'Alice';

// incorrect type assigned
const year: number = '2019';

// array and tuple
const firstNameList: string[] = ['Alice', 'Bob'];
const firstNameList2: Array<string> = ['Alice', 'Bob'];
const firstNameAndAgeTuple: [string, number] = ['Alice', 24];

// null and undefined
let u: undefined = undefined;
const n: null = null;
u = null; // behavior differently when 'strictNullChecks' is on

// function
function func1(arg1: string, arg2: number): boolean { return true; }
const func2: (arg1: string, arg2: number) => boolean = (arg1, arg2) => { return true; }
const func2Shorter = (arg1: string, arg2: number): boolean => { return true; }


// never
const alwaysError: never = null`
    }, {
      title: 'Enums and constant string',
      code:
        `enum Status {
  OK,
  Error
}

enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}

enum ConfirmText {
  Yes = 'YES',
  No = 'NO'
}
`}, {
      title: 'Constant string',
      code:
        `let hello: 'hello' = 'hello';
hello = 'world';

// useful in restricting params of a function
function isResponseYes(response: 'yes' | 'no'): boolean {
  return response === 'yes';
};
isResponseYes('yes');
`
    }, {
      title: 'Type alias and interface',
      code:
        `type StringAlias = string;
type StringOrBoolean = string | boolean;
interface Obj1 {
  foo: string;
  bar: number;
}

type Obj2 = {
  foo: string;
  bar: number;
}

interface Obj3 extends Obj1 {
  baz?: boolean;
  magic: () => void;
}

const obj: Obj3 = {

};
`
    }, {
      title: 'Interface, Intersection & Union',
      code:
        `interface Bird {
  fly: () => void;
  layEggs: () => void;
}
      
interface Fish {
  swim: () => void;
  layEggs: () => void;
}

const animalA: Bird | Fish = {

}

const animalB: Bird & Fish = {

}

type N = boolean & number;
`
    }, {
      title: 'Class',
      code:
        `class Component<T> { props: any; constructor(props: any){} }
// ignore code above

interface ComponentAProps {
  name: string;
}

class ComponentA extends Component<ComponentAProps> {
  constructor(props: ComponentAProps) {
    super(props);
  }
  
  private wrongGreeting() {
    return "Hello, " + this.props.name;
  }

  private greeting = () => {
    return "Hello, " + this.props.name;
  }

}
     
interface Named {
  name: string;
}

class Person {
  name: string;
}

let p: Named;
// OK, because of structural typing
// define what you need
p = new Person();`
    },
    {
      title: 'Object Index Signatures',
      code:
        `type AnyStringDictionary = {
  [index: string]: string;
}
      
interface Obj1 {
  foo: string;
};

const obj1: Obj1 = {
  foo: 'hello',
  bar: 'world'
};

interface Obj2 extends Obj1 {
  [index: string]: string;
}

const obj2: Obj2 = {
  foo: 'hello',
  bar: 'world'
};

type StringDictionary = Record<string, string>;
type Obj1Dictionary = Record<string, Obj1>;
`},
    {
      title: '"keyof", "in", "[property]"',
      code:
        `interface FormValues {
  firstName: string;
  lastName: string;
  age: number;
  isMember: number;
}

type AllowedFormFields = keyof FormValues;

type FormLabels = {
    [P in keyof FormValues]: string;
}

type FirstNameValue = FormValues['firstName'];
type AgeValue = FormValues['age'];

type FormValueAllowStringFormat = {
  [P in keyof FormValues]: (FormValues[P] | string);
}

`
    }, {
      title: 'Utility Helpers',
      code:
        `interface Obj {
  foo: string;
  bar?: number;
  readonly baz: boolean;
}

type PartialObj = Partial<Obj> // { [P in keyof Obj1]?: Obj1 };
type RequiredObj = Required<Obj>; // { [P in keyof Obj1]-?: Obj1 };

type ReadonlyObj = Readonly<Obj>; // { readonly [P in keyof Obj1]: Obj1 };

type Foo = Pick<Obj, 'foo'>;

type ObjectWithoutFoo = Omit<Obj, 'foo'>;

type T0 = Exclude<"a" | "b" | "c", "a">;
type T1 = Extract<"a" | "b" | "c", "a" | "f">;
type T2 = NonNullable<string | number | undefined>;

`
    }, {
      title: 'Generics',
      code:
        `type ReactNode = any;
// ignore code above
function badEcho(input: any): any {
  return input;
}
const echo1 = badEcho('Hello');

function goodEcho<T>(input: T): T {
  return input;
}
const echo2 = goodEcho<string>('Hello');

function okOrCancel<T extends 'OK' | 'Cancel'>(input: T): T {
  return input;
}

const echo3 = okOrCancel('Hello');

class MyError<T = 'string'> {}
const myError = new MyError(); 

interface ListItemProps<T> {
  items: T[];
  itemRender: (item: T, index: number) => ReactNode;
}`
    },
    {
      title: 'Type Inference',
      code:
        `type ReactNode = object;
// ignore code above

function echo<T>(input: T): T {
  return input;
}
const echo1 = echo('Hello');
let echo2 = echo('Hello');

function renderItems<T>(items: T[], renderItem: (item: T) => ReactNode): ReactNode { return; }

renderItems(['foo', 'bar'], str => {
  return {};
});

renderItems(['foo', 3], str => {
  return {};
});

`
    }, {
      title: 'Type Inference: typeof',
      code:
        `const english = {
  ok: 'OK',
  cancel: 'Cancel',
  stop: 'Stop'
}

type Translations = typeof english;

const klingon: Translations = {
  ok: 'luq',
  cancel: 'qIl',
  stop: 'mev',
  notValid: 'nah'
}`
    }, {
      title: 'Type Inference - Advanced Case',
      code: `interface Store {
  user: {
    id: string;
    name: string;
    age: number;
    isMemeber: boolean;
  },
  cart: {
    id: string;
    promoCode: string;
    total: number;
  }
}

function accessStoreValue<T extends keyof Store, U extends keyof Store[T]>(
    group: T, key: U) {}

accessStoreValue('cart', 'promoCode');
`
    }, {
      title: 'Type Assertion / Guard',
      code: `interface Bird {
  fly: () => void;
  layEggs: () => void;
}
      
interface Fish {
  swim: () => void;
  layEggs: () => void;
}

let pet: Bird | Fish;

pet.layEggs();
(pet as Bird).fly();
const birdPet = (pet as Bird);
birdPet.fly();

function isBird(x: Bird | Fish): x is Bird {
  return !!(x as Bird).fly;
} 

if (isBird(pet)) {
  pet.fly();
}`
    },
    {
      title: 'Type Guard - Object Literal',
      code: `const obj1 = {
  foo: 1,
  bar: 2,
  baz: '3'
}

const obj2: Record<string, number> = {
  foo: 1,
  bar: 2,
  baz: 3
}

// use a type guard function to do the trick!
const obj2Trick = (<T extends Record<string, number>>(obj: T): T => obj)({
  foo: 1,
  bar: 2,
  baz: 3
});`
    },
    {
      title: 'Plz do not use "any"',
      code: `function toUpperCase(input: string): string {
    return input.toUpperCase();
}

let a: any = 3;
toUpperCase(a); // CRASH!

// Things that can help: 
// 1. only type those needed in a code
// 2. https://quicktype.io/typescript/
// 3. use 'unknown' for uncertainty instead of 'any'


interface ServerResponse {
    id: string;
    name: string;
    [index: string]: unknown;
}

`},
    {
      title: 'FAQ Playground',
      code: `// TypeScript handbook is always your best friend! 
// https://www.typescriptlang.org/docs/handbook/basic-types.html`
    }

  ]


const App: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const page = pages[pageIndex];
  return (
    <div className="App">
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.body || '' }} />
      <div className="App-editor">
        <MonacoEditor
          height="600"
          width='100%'
          language="typescript"
          theme="vs-light"
          options={{
            fontSize: 21
          }}
          onChange={code => page.code = code}
          value={page.code}
        />
      </div>
      <div className={'App-button-group'} >
        <button className={'App-button'} onClick={() => setPageIndex(pageIndex - 1)} disabled={pageIndex === 0}>Previous</button>
        <span>{pageIndex + 1} / {pages.length}</span>
        <button className={'App-button'} onClick={() => setPageIndex(pageIndex + 1)} disabled={pageIndex === pages.length - 1}>Next</button>
      </div>
    </div>
  );
}

export default App;
