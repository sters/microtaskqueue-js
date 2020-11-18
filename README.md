# microtaskqueue-js

For exmaple...

```js
const taskQueue = new MicroTaskQueue;

taskQueue.add(() => {
    const css = document.createElement('style');
    css.innerText = 'a { color:red !important; }';
    document.querySelector('head').appendChild(css);
});

taskQueue.addEachDom('div', (d) => {
    LetsDoSomethingHeavyLoadTaskForEachDivElement(d);
});

taskQueue.start();
```
