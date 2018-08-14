Example:

```js
function accessor(data, cc) { 
    const element = data.find((elem) => elem.country == cc);
    if(element) {
        return element.value;
    }

    return 0;
}

<MapChart data={[{country: 'MX', value: 500}]} accessor={accessor} valueAccessor={(d) => d.value} valueFormat='F' height={300} width={500} />
```
