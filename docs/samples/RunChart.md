Example:
```js
const data = [
    {
        date: new Date('6', '6', '2017'),
        value: 50
    },
    {
        date: new Date('8', '8', '2017'),
        value: 30
    },
    {
        date: new Date('12', '12', '2018'),
        value: 60
    }
];

<RunChart data={data} dateAccessor={(el) => el.date} valueAccessor={(d) => d.value} height={200} width={800}
    dateFormat='MM/DD/YYYY'
    startDate={new Date('1', '1', '2017')}
    endDate={new Date('12', '31', '2018')} />
```
