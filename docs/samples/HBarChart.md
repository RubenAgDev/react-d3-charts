Example:

```js
const data = [
    {
        tag: 'Mexico',
        value: 5
    },
    {
        tag: 'South Korea',
        value: 3
    },
    {
        tag: 'United States',
        value: 6
    }
];

<HBarChart barHeight={50} data={data} tagAccessor={(el) => el.tag} valueAccessor={(d) => d.value} valueFormat='F' height={200} width={800} />
```